export const formatDate = (iso: string): string => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

export const formatTime = (time?: string | null): string => time?.slice(0, 5) || '';
