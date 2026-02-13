import { Zap, Shield, Bot, Search, Lock, Share2 } from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: <Bot className="w-8 h-8 text-blue-600" />,
            title: "AI-Powered Chat",
            description: "Engage with your documents naturally. Our advanced AI understands context and intent."
        },
        {
            icon: <Search className="w-8 h-8 text-blue-600" />,
            title: "Smart Retrieval",
            description: "Instantly find the exact information you need from thousands of pages."
        },
        {
            icon: <Shield className="w-8 h-8 text-blue-600" />,
            title: "Enterprise Security",
            description: "Bank-grade encryption for your data at rest and in transit."
        },
        {
            icon: <Zap className="w-8 h-8 text-blue-600" />,
            title: "Lightning Fast",
            description: "Get answers in milliseconds, powered by optimized vector search."
        },
        {
            icon: <Lock className="w-8 h-8 text-blue-600" />,
            title: "Role-Based Access",
            description: "Control who sees what with granular permission settings."
        },
        {
            icon: <Share2 className="w-8 h-8 text-blue-600" />,
            title: "Easy Collaboration",
            description: "Share knowledge bases with your team securely."
        },
        {
            icon: <Bot className="w-8 h-8 text-blue-600" />,
            title: "Floating Chat Widget",
            description: "Clean, intuitive UI with a floating widget that stays available on every page."
        },
        {
            icon: <Zap className="w-8 h-8 text-blue-600" />,
            title: "Typing Indicators & Streaming",
            description: "Typing indicators and smooth message streaming make conversations feel natural in real time."
        }
    ];

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600">Deploy faster</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Everything you need to deploy your knowledge base
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        NexusAI provides a comprehensive suite of tools to turn your static documents into an interactive knowledge engine.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {features.map((feature) => (
                            <div key={feature.title} className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
                                        {feature.icon}
                                    </div>
                                    {feature.title}
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default Features;
