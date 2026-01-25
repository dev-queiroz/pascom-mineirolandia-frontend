import { Link } from 'react-router-dom';
import { useAuthStore } from '../contexts/authStore';

export default function Sidebar() {
    const { logout } = useAuthStore();

    return (
        <div className="w-64 bg-blue-800 text-white h-screen p-6">
            <h1 className="text-2xl font-bold mb-10">PASCOM</h1>
            <nav className="space-y-4">
                <Link to="/dashboard" className="block py-2 hover:bg-blue-700 rounded">Dashboard</Link>
                <Link to="/events" className="block py-2 hover:bg-blue-700 rounded">Escalas</Link>
                <Link to="/financial" className="block py-2 hover:bg-blue-700 rounded">Contribuição</Link>
            </nav>
            <button
                onClick={logout}
                className="mt-20 w-full bg-red-600 py-3 rounded hover:bg-red-700"
            >
                Sair
            </button>
        </div>
    );
}