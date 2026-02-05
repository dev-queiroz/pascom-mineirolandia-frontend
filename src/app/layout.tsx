import type { Metadata } from 'next';
import '../styles/globals.css';
import Providers from "@/providers/query-provider";
import { Toaster } from '@/components/ui/sonner';
import React from "react";

export const metadata: Metadata = {
    title: 'PASCOM Mineirolândia',
    description: 'Sistema Pastoral da Comunicação',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
        <body className="antialiased bg-[#050505]">
        <Providers>
            {children}
        </Providers>
        <Toaster
            position="top-center"
            richColors
            toastOptions={{
                className:
                    'bg-zinc-900 text-white border border-white/10 shadow-xl opacity-100',
                duration: 1000,
            }}
        />
        </body>
        </html>
    );
}