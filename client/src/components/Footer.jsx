import { Link } from 'react-router-dom';
import { Bot, Twitter, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <Bot className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">Knowledge AI</span>
                        </Link>
                        <p className="text-sm text-gray-500 mb-6">
                            Transforming your documents into intelligent conversations. Secure, fast, and accurate RAG solutions.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li><Link to="/features" className="text-base text-gray-500 hover:text-blue-600 transition-colors">Features</Link></li>

                            <li><Link to="/security" className="text-base text-gray-500 hover:text-blue-600 transition-colors">Security</Link></li>
                            <li><Link to="/roadmap" className="text-base text-gray-500 hover:text-blue-600 transition-colors">Roadmap</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="text-base text-gray-500 hover:text-blue-600 transition-colors">About</Link></li>
                            {/* <li><Link to="/blog" className="text-base text-gray-500 hover:text-blue-600 transition-colors">Blog</Link></li> */}
                            {/* <li><Link to="/careers" className="text-base text-gray-500 hover:text-blue-600 transition-colors">Careers</Link></li> */}
                            {/* <li><Link to="/contact" className="text-base text-gray-500 hover:text-blue-600 transition-colors">Contact</Link></li> */}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Legal</h3>
                        <ul className="space-y-3">
                            <li><Link to="/privacy" className="text-base text-gray-500 hover:text-blue-600 transition-colors">Privacy</Link></li>
                            <li><Link to="/terms" className="text-base text-gray-500 hover:text-blue-600 transition-colors">Terms</Link></li>
                            {/* <li><Link to="/cookie-policy" className="text-base text-gray-500 hover:text-blue-600 transition-colors">Cookie Policy</Link></li> */}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-100 pt-8">
                    <p className="text-base text-gray-400 text-center">
                        &copy; {new Date().getFullYear()} Knowledge AI Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
