import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const OAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();

    const processed = useRef(false);

    useEffect(() => {
        if (processed.current) return;
        processed.current = true;

        const token = searchParams.get('token');

        if (token) {
            loginWithToken(token)
                .then((res) => { // Assuming loginWithToken returns a promise resolving to success object or throws
                    if (res?.success) {
                        toast.success('Successfully logged in with Google!');
                        navigate('/');
                    } else {
                        throw new Error(res?.message || 'Login failed');
                    }
                })
                .catch((error) => {
                    console.error('OAuth login error:', error);
                    toast.error('Failed to login with Google.');
                    navigate('/login');
                });
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate, loginWithToken]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900">Logging you in...</h2>
                <p className="text-gray-500 mt-2">Please wait while we verify your credentials.</p>
            </div>
        </div>
    );
};

export default OAuthSuccess;
