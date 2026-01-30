'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function Header() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex justify-between items-center shadow-sm">
            <div>
                <h2 className="text-xl font-semibold">
                    {user ? `Bem-vindo, ${user.username}` : 'PASCOM'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.funcao === 'admin' ? 'Administrador' : 'Membro'}
                </p>
            </div>

            <Button variant="ghost" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Sair
            </Button>
        </header>
    );
}