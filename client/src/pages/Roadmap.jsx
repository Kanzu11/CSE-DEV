const Roadmap = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Product Roadmap</h1>
                <div className="space-y-12">
                    <div className="border-l-4 border-blue-600 pl-8 relative">
                        <span className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-blue-600 border-4 border-white"></span>
                        <h2 className="text-2xl font-bold text-gray-900">Q1 2026 - Foundation</h2>
                        <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
                            <li>Launch of Knowledge AI Core</li>
                            <li>Basic RAG (Retrieval-Augmented Generation) pipeline</li>
                            <li>PDF and Text document support</li>
                            <li>Admin Dashboard for document management</li>
                        </ul>
                    </div>

                    <div className="border-l-4 border-gray-200 pl-8 relative">
                        <span className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-gray-200 border-4 border-white"></span>
                        <h2 className="text-2xl font-bold text-gray-900">Q2 2026 - Expansion</h2>
                        <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
                            <li>Multi-modal support (Images, Charts)</li>
                            <li>Team collaboration features</li>
                            <li>API access for developers</li>
                            <li>Slack and Discord integrations</li>
                        </ul>
                    </div>

                    <div className="border-l-4 border-gray-200 pl-8 relative">
                        <span className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-gray-200 border-4 border-white"></span>
                        <h2 className="text-2xl font-bold text-gray-900">Q3 2026 - Enterprise</h2>
                        <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
                            <li>SSO (Single Sign-On) Integration</li>
                            <li>Advanced Analytics Dashboard</li>
                            <li>Custom Model Fine-tuning</li>
                            <li>On-premise deployment options</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Roadmap;
