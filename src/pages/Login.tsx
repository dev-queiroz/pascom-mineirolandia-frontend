import { useState } from 'react';
import { useAuthStore } from '../contexts/authStore';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login({ username, password });
            navigate('/dashboard');
        } catch {
            setError('Usuário ou senha inválidos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 relative overflow-hidden">
            {/* Background animado sutil */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05)_0%,transparent_50%)] animate-pulse-slow"></div>

            <div className="relative z-10 bg-white/5 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/10 w-full max-w-md transform transition-all duration-500 hover:scale-105">
                {/* Logo / Título */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-lg">
                        PASCOM
                    </h1>
                    <p className="text-gray-300 mt-2 text-lg font-light">
                        Pastoral da Comunicação
                    </p>
                </div>

                {/* Erro */}
                {error && (
                    <div className="bg-red-500/30 border border-red-400 text-red-200 px-4 py-3 rounded-xl mb-6 text-center animate-shake">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300"
                            placeholder="Usuário"
                            required
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300"
                            placeholder="Senha"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                            loading
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 shadow-lg shadow-cyan-500/30'
                        } text-white`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Entrando...
              </span>
                        ) : (
                            'Entrar'
                        )}
                    </button>
                </form>

                {/* Rodapé */}
                <p className="text-center text-gray-400 text-sm mt-8">
                    Sistema Pastoral da Comunicação - Mineirolândia
                </p>
            </div>
        </div>
    );
}