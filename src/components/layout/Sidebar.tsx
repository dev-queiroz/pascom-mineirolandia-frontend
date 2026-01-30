'use client';

import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Calendar, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/events', label: 'Escalas', icon: Calendar },
    { path: '/financial', label: 'Contribuição', icon: DollarSign },
    { path: '/admin/users', label: 'Usuários (Admin)', icon: Users, adminOnly: true },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const isAdmin = user?.funcao === 'admin';

    const handleLogout = () => {
        logout();
    };

    return (
        <aside className="hidden md:flex flex-col w-72 bg-gradient-to-b from-indigo-950 to-purple-950 text-white h-screen shadow-2xl">
            <div className="p-8 border-b border-white/10">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    PASCOM
                </h1>
                <p className="text-sm text-gray-400 mt-1">Mineirolândia</p>
            </div>

            <nav className="flex-1 p-6 space-y-2">
                {menuItems.map(item => {
                    if (item.adminOnly && !isAdmin) return null;

                    const isActive = pathname.startsWith(item.path);

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
                                isActive
                                    ? 'bg-white/10 text-white shadow-inner'
                                    : 'hover:bg-white/5 text-gray-200'
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-white/10">
                <Button
                    variant="destructive"
                    className="w-full justify-start gap-3"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5" />
                    Sair
                </Button>
            </div>
        </aside>
    );
}