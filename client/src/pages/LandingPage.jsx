import { ArrowRight, Bot, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TextPressure from '../components/TextPressure';

const LandingPage = () => {
    const { user } = useAuth();

    const isLoggedIn = !!user;

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 -z-10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="mb-6 h-24 md:h-28">
                        <TextPressure
                            text={isLoggedIn ? `Welcome back, ${user.username}` : 'Analyze Documents with Knowledge AI'}
                            textColor="#111827"
                            stroke={false}
                            scale={false}
                            minFontSize={32}
                            className="mx-auto"
                        />
                    </div>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        {isLoggedIn
                            ? 'Jump back into your workspace and continue asking questions about your documents — all for free.'
                            : 'Upload your documents and let our advanced RAG chatbot answer your questions instantly. Secure, fast, accurate, and completely free.'}
                    </p>
                    <div className="flex justify-center gap-4">
                        {isLoggedIn ? (
                            <>
                                {(user.role === 'admin' || user.role === 'superadmin') && (
                                    <Link
                                        to="/admin"
                                        className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:bg-blue-700 transition-all flex items-center"
                                    >
                                        Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                )}
                                <Link
                                    to="/features"
                                    className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold shadow-md hover:shadow-lg border border-gray-200 transition-all"
                                >
                                    Explore Features
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/signup"
                                    className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:bg-blue-700 transition-all flex items-center"
                                >
                                    Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                                <Link
                                    to="/features"
                                    className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold shadow-md hover:shadow-lg border border-gray-200 transition-all"
                                >
                                    Learn More
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">Why Choose Knowledge AI?</h2>
                        <p className="mt-4 text-gray-600">Everything you need to unlock the potential of your knowledge base.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Bot className="w-8 h-8 text-blue-600" />}
                            title="Instant Answers"
                            description="Our RAG engine retrieves the exact information you need from your uploaded documents in milliseconds."
                        />
                        <FeatureCard
                            icon={<Shield className="w-8 h-8 text-blue-600" />}
                            title="Enterprise Security"
                            description="Your data is encrypted at rest and in transit. Granular access controls ensure only authorized users see sensitive data."
                        />
                        <FeatureCard
                            icon={<Zap className="w-8 h-8 text-blue-600" />}
                            title="Seamless Integration"
                            description="Works with PDF, DOCX, and TXT files. integrate easily with your existing workflow."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group">
        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
);

export default LandingPage;
