'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';

interface HeaderProps {
    onOpenMenu: () => void;
}

export default function Header({ onOpenMenu }: HeaderProps) {
    const { user, logout, isLoading } = useAuth();

    return (
        <header className="min-h-16 md:h-20 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 px-4 md:px-8 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10" onClick={onOpenMenu}>
                    <Menu className="w-6 h-6" />
                </Button>

                <div className="hidden md:block">
                    <p className="text-white font-bold text-lg tracking-tight">Sistema Interno</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end mr-2">
                    {isLoading ? (
                        <div className="h-4 w-24 bg-white/10 animate-pulse rounded" />
                    ) : (
                        <>
                            <p className="text-sm font-bold text-white leading-none">{user?.username}</p>
                            <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold mt-1">
                                {user?.funcao === 'admin' ? 'Administrador' : 'Membro'}
                            </p>
                        </>
                    )}
                </div>

                <Button
                    variant="ghost"
                    onClick={() => logout()}
                    className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
                >
                    <LogOut className="w-5 h-5" />
                </Button>
            </div>
        </header>
    );
}