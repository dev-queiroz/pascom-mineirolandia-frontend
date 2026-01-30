'use client';

import { useState } from 'react';
import { loginAction } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Church } from 'lucide-react';
import {useAuth} from "@/hooks/useAuth";

export default function LoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        const formData = new FormData(e.currentTarget);
        login(formData, {
            onError: () => {
                setError('Usuário ou senha inválidos. Tente novamente.');
            }
        });
    };

    return (
        <main className="min-h-screen w-full flex flex-col md:flex-row bg-[#050505] text-white overflow-hidden">

            {/* LADO ESQUERDO: Visual / Branding (Oculto em telas muito pequenas ou adaptado) */}
            <div className="relative hidden md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 items-center justify-center p-12">
                {/* Efeito de luz no fundo */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="absolute w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px] animate-pulse"></div>

                <div className="relative z-10 text-center">
                    <div className="inline-flex p-4 rounded-3xl bg-white/10 backdrop-blur-md mb-6 border border-white/20 shadow-2xl">
                        <Church className="w-16 h-16 text-white" />
                    </div>
                    <h1 className="text-8xl lg:text-9xl font-black tracking-tighter leading-none">
                        PAS<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">COM</span>
                    </h1>
                    <p className="text-2xl font-light tracking-[0.2em] text-indigo-200 mt-4 uppercase">
                        Pastoral da Comunicação
                    </p>
                    <div className="mt-8 h-1 w-24 bg-gradient-to-r from-cyan-500 to-pink-500 mx-auto rounded-full"></div>
                </div>
            </div>

            {/* LADO DIREITO: Formulário */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-[#0a0a0a] relative">
                {/* Decoração sutil para o mobile não ficar "vazio" */}
                <div className="md:hidden absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-900/50 to-transparent"></div>

                <div className="w-full max-w-md relative z-10">
                    <div className="mb-10 md:hidden text-center">
                        <h2 className="text-4xl font-black tracking-tighter">PASCOM</h2>
                        <p className="text-gray-400 text-sm">Mineirolândia</p>
                    </div>

                    <div className="mb-10 hidden md:block">
                        <h2 className="text-3xl font-bold">Bem-vindo de volta</h2>
                        <p className="text-gray-400 mt-2">Acesse sua conta para gerenciar o sistema.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-2xl flex items-center gap-3 animate-shake">
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-300 ml-1">Usuário</Label>
                            <Input
                                name="username"
                                placeholder="ex: admin_pascom"
                                className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all text-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-300 ml-1">Senha</Label>
                            <Input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all text-lg"
                            />
                        </div>

                        <Button
                            className="w-full h-14 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 ..."
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Autenticando...
                                </span>
                            ) : (
                                "Entrar no Sistema"
                            )}
                        </Button>
                    </form>

                    <footer className="mt-12 text-center text-gray-600 text-xs">
                        <p>MINEIROLÂNDIA • CEARÁ</p>
                        <p className="mt-1">© 2026 Sistema PASCOM</p>
                    </footer>
                </div>
            </div>
        </main>
    );
}