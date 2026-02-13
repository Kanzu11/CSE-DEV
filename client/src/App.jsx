import { Routes, Route } from 'react-router-dom';
import { API_URL } from './config'; // Configuration for API Endpoints
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import About from './pages/About';
import Security from './pages/Security';
import Roadmap from './pages/Roadmap';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ChatWidget from './components/ChatWidget';
import ProtectedRoute from './components/ProtectedRoute';
import Features from './pages/Features';
import Footer from './components/Footer';
import OAuthSuccess from './pages/OAuthSuccess';

import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen flex flex-col">
                <Toaster position="top-right" />
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/features" element={<Features />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/security" element={<Security />} />
                        <Route path="/roadmap" element={<Roadmap />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/oauth-success" element={<OAuthSuccess />} />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute role="admin">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/super-admin"
                            element={
                                <ProtectedRoute role="superadmin">
                                    <SuperAdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
                <Footer />
                <ChatWidget />
            </div>
        </AuthProvider>
    );
}

export default App;
