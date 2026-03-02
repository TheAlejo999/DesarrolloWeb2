import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { logoutUser } from '../../services/authService';

export default function Navbar() {
    const {user, clearUser} = useAuthStore();
    const { theme, toggleTheme } = useUIStore();
    const navigate = useNavigate();

    const isDarkMode = theme === 'dark';

    const handleLogout = async () => {
        const result = await logoutUser();
        if (result.success) {
            clearUser();
            navigate('/login');
        }
    };

    const handleToggleDarkMode = () => {
        toggleTheme();
        if (theme === 'light') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <nav className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-md transition-colors`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            Task Manager Pro
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {user?.displayName || user?.email}
                        </span>
                        <button 
                            onClick={handleToggleDarkMode}
                            className={`px-3 py-2 rounded-lg transition-colors ${
                                isDarkMode 
                                    ? 'bg-gray-800 hover:bg-gray-700' 
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                            title={isDarkMode ? 'Tema claro' : 'Tema oscuro'}
                        >
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>
                        <button onClick={handleLogout} className="btn-secondary">
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}