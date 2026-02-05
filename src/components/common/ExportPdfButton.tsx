'use client';

import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { eventService } from '@/services/eventService';
import { toast } from 'sonner';
import { useState } from 'react';

export default function ExportPdfButton({ monthStr }: { monthStr: string }) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            await eventService.downloadScalePdf(monthStr);
            toast.success("PDF gerado com sucesso!");
        } catch {
            toast.error("Erro ao gerar PDF.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleDownload}
            disabled={loading}
            className="
              bg-rose-500 hover:bg-rose-600 text-white
              rounded-2xl font-bold shadow-lg shadow-rose-900/20
              h-auto px-4 py-3
              flex flex-col sm:flex-row items-center gap-1 sm:gap-2
              text-sm sm:text-base
              transition-all active:scale-95
            "
        >

        <FileText className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
            {loading ? 'Gerando...' : 'Exportar Escala PDF'}
        </Button>
    );
}