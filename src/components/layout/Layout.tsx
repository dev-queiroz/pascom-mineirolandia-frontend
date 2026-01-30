'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen w-full bg-[#050505] overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Header onOpenMenu={() => setIsSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto bg-[#050505]">
                    <div className="p-4 md:p-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}