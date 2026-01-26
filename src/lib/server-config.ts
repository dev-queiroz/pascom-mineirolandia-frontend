export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pascom-backend.onrender.com';

if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL não está definida no ambiente');
}