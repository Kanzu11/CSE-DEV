const About = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">About Knowledge AI</h1>
                <div className="prose prose-blue max-w-none text-gray-600 text-lg">
                    <p className="mb-6">
                        Knowledge AI is dedicated to solving the information overload problem. We believe that organizations shouldn't struggle to find the knowledge they already possess.
                    </p>
                    <p className="mb-6">
                        Founded in 2025, our mission is to build the most intelligent, secure, and easy-to-use knowledge base interface for teams of all sizes. By combining state-of-the-art vector search with advanced large language models, we turn static documents into dynamic conversations.
                    </p>
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 my-12">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Vision</h3>
                        <p className="italic">
                            "To make the world's knowledge instantly accessible and actionable for everyone."
                        </p>
                    </div>
                    <p>
                        We are a team of engineers, researchers, and designers passionate about AI and User Experience. We are building the future of work, one document at a time.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
