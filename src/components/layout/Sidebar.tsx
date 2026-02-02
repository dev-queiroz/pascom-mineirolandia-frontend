'use client';

import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {LayoutDashboard, Calendar, DollarSign, Users, X, ShieldCheck, ShieldAlert} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from "next/image";

const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/events', label: 'Escalas', icon: Calendar },
    { path: '/admin/events', label: 'Moderação Esc.', icon: ShieldAlert, adminOnly: true },
    { path: '/financial', label: 'Contribuição', icon: DollarSign },
    { path: '/admin/financial', label: 'Moderação Fin.', icon: ShieldCheck, adminOnly: true },
    { path: '/admin/users', label: 'Usuários', icon: Users, adminOnly: true },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { user } = useAuth();

    const isAdmin = user?.funcao === 'admin';

    return (
        <>
            <div
                className={cn("fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}
                onClick={onClose}
            />

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[18rem] bg-[#0a0a0a] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-72",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-white/10 border border-white/20 rounded-lg overflow-hidden">
                            <Image
                                src="/assets/brasao-paroquia.png"
                                alt="Brasão da Paróquia"
                                fill
                                className="object-contain p-1"
                                priority
                            />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tighter">PASCOM</h1>
                    </div>
                    <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10" onClick={onClose}>
                        <X className="w-6 h-6" />
                    </Button>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    {menuItems.map(item => {
                        if (item.adminOnly && !isAdmin) return null;

                        const isActive = pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => onClose()}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group',
                                    isActive
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-600/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 transition-transform", isActive ? "text-white" : "group-hover:scale-110")} />
                                <span className="font-semibold">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 mt-auto">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Mineirolândia • CE</p>
                        <p className="text-[10px] text-gray-600 mt-1 italic leading-tight">Pastoral da Comunicação</p>
                    </div>
                </div>
            </aside>
        </>
    );
}