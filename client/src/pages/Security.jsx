
const Security = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Security at Knowledge AI</h1>
                <div className="prose prose-blue max-w-none">
                    <p className="text-lg text-gray-600 mb-6">
                        We take the security of your data seriously. Our infrastructure is built with enterprise-grade security standards to ensure your documents and conversations remain private and protected.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Encryption</h2>
                    <p className="text-gray-600 mb-4">
                        All data is encrypted in transit using TLS 1.2+ and at rest using AES-256 encryption. Your keys are managed with industry-leading KMS solutions.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Data Privacy</h2>
                    <p className="text-gray-600 mb-4">
                        We do not train our foundational models on your private data. Your knowledge base is isolated and used solely for retrieving context for your specific queries.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Access Control</h2>
                    <p className="text-gray-600 mb-4">
                        Strict role-based access control (RBAC) ensures that only authorized personnel have access to system operations. We perform regular security audits and penetration testing.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Security;
