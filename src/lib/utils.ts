import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { jwtDecode } from 'jwt-decode';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoDate: string | Date): string {
  if (!isoDate) return '';
  const date = typeof isoDate === 'string' && !isoDate.includes('T')
      ? new Date(`${isoDate}T00:00:00Z`)
      : new Date(isoDate);

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

export function formatTime(time?: string | null): string {
  return time ? time.slice(0, 5) : '';
}

export function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? Number(value) : value;
  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function decodeToken<T>(token: string): T | null {
  try {
    return jwtDecode<T>(token);
  } catch {
    return null;
  }
}