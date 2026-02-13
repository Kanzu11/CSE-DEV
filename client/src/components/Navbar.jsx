import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Shield, Star } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Bot className="h-8 w-8 text-blue-600" />
                        <Link to="/" className="text-2xl font-bold bg-blue-600 bg-clip-text text-transparent">
                            Knowledge AI
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Home</Link>
                        <Link to="/features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Features</Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                {user.role === 'superadmin' && (
                                    <Link to="/super-admin" className="flex items-center text-gray-600 hover:text-blue-600">
                                        <Star className="w-5 h-5 mr-1 text-yellow-500" />
                                        <span className="hidden sm:inline">Super Admin</span>
                                    </Link>
                                )}
                                {(user.role === 'admin' || user.role === 'superadmin') && (
                                    <Link to="/admin" className="flex items-center text-gray-600 hover:text-blue-600">
                                        <Shield className="w-5 h-5 mr-1" />
                                        <span className="hidden sm:inline">Admin</span>
                                    </Link>
                                )}
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-700">{user.username}</span>
                                    <button
                                        onClick={logout}
                                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-red-500 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Log in</Link>
                                <Link
                                    to="/signup"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30"
                                >
                                    Get Started Free
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
