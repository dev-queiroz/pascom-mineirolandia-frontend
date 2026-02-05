'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Church, Sparkles } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    const [error, setError] = useState('');
    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        const formData = new FormData(e.currentTarget);
        login(formData, {
            onSuccess: () => toast.success('Autenticado com sucesso!'),
            onError: () => toast.error('Falha na autenticação. Verifique suas credenciais.')
        });
    };

    return (
        <main className="min-h-screen w-full flex flex-col md:flex-row bg-[#050505] text-white overflow-x-hidden">

            <div className="relative hidden md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 items-center justify-center p-12">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                <div className="absolute w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px] animate-pulse" />

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
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-[#020202] relative">
                <div className="md:hidden absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/40 via-[#020202] to-[#020202]" />
                    <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[320px] h-[320px] bg-cyan-500/20 blur-[120px]" />
                </div>

                <div className="w-full max-w-md relative z-10">
                    <div className="mb-10 text-center md:hidden space-y-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            <span className="text-cyan-400 text-[9px] font-black uppercase tracking-[0.3em]">
                                PASCOM Mineirolândia
                              </span>
                        </div>

                        <div className="flex justify-center">
                            <div className="relative w-25 h-25 mx-auto rounded-3xl bg-white/5 border border-white/10 shadow-xl overflow-hidden">
                                <Image
                                    src="/assets/brasao-paroquia.png"
                                    alt="Brasão da Paróquia"
                                    fill
                                    priority
                                    className="object-contain p-1"
                                />
                            </div>
                        </div>

                        <h2 className="text-4xl font-black tracking-tighter uppercase italic">
                            Área Administrativa
                        </h2>
                        <p className="text-gray-400 text-sm">
                            Comunicação a serviço da missão
                        </p>
                    </div>

                    <div className="mb-10 hidden md:block">
                        <h2 className="text-3xl font-bold">Bem-vindo de volta</h2>
                        <p className="text-gray-400 mt-2">Acesse sua conta para gerenciar o sistema.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-2xl flex items-center gap-3">
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
                                className="h-12 sm:h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-cyan-500 text-base"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-300 ml-1">Senha</Label>
                            <Input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="h-12 sm:h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-cyan-500 text-base"
                            />
                        </div>

                        <Button
                            className="w-full h-14 mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black italic uppercase tracking-widest rounded-2xl shadow-lg shadow-cyan-900/40 transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2 text-sm">
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  Autenticando…
                                </span>
                            ) : (
                                "Entrar no Sistema"
                            )}
                        </Button>
                    </form>

                    <div className="mb-20 mt-10 text-center">
                        <Link href="/">
                            <Button
                                variant="ghost"
                                className="text-gray-400 hover:text-white hover:bg-white/5 rounded-xl px-3"
                            >
                                ← Voltar para a página inicial
                            </Button>
                        </Link>
                    </div>

                    <footer className="mt-12 text-center text-gray-600 text-xs">
                        <p>MINEIROLÂNDIA • CEARÁ</p>
                        <p className="mt-1">© 2026 Sistema PASCOM</p>
                    </footer>
                </div>
            </div>
        </main>
    );
}
