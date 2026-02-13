import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { MessageCircle, X, Send, Bot, User, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I can help you find information in your knowledge base. Ask me anything!' }
    ]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [historyId, setHistoryId] = useState(null);
    const { user } = useAuth();
    const messagesEndRef = useRef(null);
    const abortControllerRef = useRef(null); // Ref to hold AbortController

    // Chat history state
    const [histories, setHistories] = useState([]);
    const [loadingHistories, setLoadingHistories] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const [streamingContent, setStreamingContent] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, streamingContent, loading]);

    // Load chat histories when the widget opens and user is logged in
    useEffect(() => {
        if (!isOpen || !user) return;
        fetchHistories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, user]);

    const fetchHistories = async () => {
        try {
            setLoadingHistories(true);
            const res = await api.get('/chat');
            setHistories(res.data || []);
        } catch (err) {
            console.error('Failed to load chat history', err);
        } finally {
            setLoadingHistories(false);
        }
    };

    const simulateStreaming = async (text) => {
        setIsStreaming(true);
        setStreamingContent('');
        const words = text.split(' ');

        for (let i = 0; i < words.length; i++) {
            setStreamingContent(prev => prev + (i === 0 ? '' : ' ') + words[i]);
            await new Promise(resolve => setTimeout(resolve, 30)); // Adjust speed here
            scrollToBottom();
        }

        setIsStreaming(false);
        setMessages(prev => [...prev, { role: 'assistant', content: text }]);
        setStreamingContent('');
    };

    const handleSelectHistory = (history) => {
        if (!history) return;
        // Replace current messages with the selected conversation
        const hydratedMessages = (history.messages || []).map(m => ({
            role: m.role,
            content: m.content,
        }));

        // If there are no messages, keep the greeting
        setMessages(
            hydratedMessages.length > 0
                ? hydratedMessages
                : [{ role: 'assistant', content: 'Hi! I can help you find information in your knowledge base. Ask me anything!' }]
        );
        setHistoryId(history._id);
        setShowHistory(false);
    };

    const handleNewChat = () => {
        setMessages([
            { role: 'assistant', content: 'Hi! I can help you find information in your knowledge base. Ask me anything!' }
        ]);
        setHistoryId(null);
        setQuery('');
        setStreamingContent('');
        setShowHistory(false); // Fix: Close history panel when starting new chat
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim() || loading || isStreaming) return;

        if (!user) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Please log in to chat with me.' }]);
            return;
        }

        const userMessage = { role: 'user', content: query };
        setMessages(prev => [...prev, userMessage]);
        setQuery('');
        setLoading(true);

        // Create new AbortController
        abortControllerRef.current = new AbortController();

        try {
            const response = await api.post('/chat',
                { message: userMessage.content, historyId },
                { signal: abortControllerRef.current.signal } // Pass signal to axios
            );
            setLoading(false); // Stop loading animation
            await simulateStreaming(response.data.response); // Start streaming

            if (response.data.historyId) {
                setHistoryId(response.data.historyId);
            }
        } catch (error) {
            if (api.isCancel(error)) {
                console.log('Request canceled');
                setLoading(false);
                // Optional: Add a message indicating cancellation
                // setMessages(prev => [...prev, { role: 'assistant', content: 'Generation stopped.' }]);
            } else {
                console.error('Chat error', error);
                setLoading(false);
                toast.error('Failed to get response. Please try again.');
                setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, checking the knowledge base failed. Please try again later.' }]);
            }
        }
    };

    const handleStopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setLoading(false);
        }
    };

    const handleDeleteHistory = async (e, idToDelete) => {
        e.stopPropagation();
        try {
            await api.delete(`/chat/${idToDelete}`);
            toast.success('Conversation deleted');
            setHistories(prev => prev.filter(h => h._id !== idToDelete));
            if (historyId === idToDelete) {
                handleNewChat();
            }
        } catch (error) {
            console.error('Delete failed', error);
            toast.error('Failed to delete conversation');
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            {isOpen && (
                <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-up transition-all duration-300">
                    {/* Header */}
                    <div className="bg-blue-600 p-4 flex justify-between items-center text-white shadow-md">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm tracking-wide">Knowledge AI</h3>
                                <span className="flex items-center text-[10px] text-blue-100 font-medium uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                                    Online
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {user && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleNewChat}
                                        className="px-2 py-1 text-[10px] font-medium rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                    >
                                        New
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowHistory(prev => !prev);
                                            if (!histories.length) {
                                                fetchHistories();
                                            }
                                        }}
                                        className="px-2 py-1 text-[10px] font-medium rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                    >
                                        History
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Messages + History overlay */}
                    <div className="relative flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-200">
                        {/* History panel */}
                        {showHistory && user && (
                            <div className="absolute inset-0 z-10 bg-white/95 border-b border-gray-200 shadow-sm rounded-t-2xl overflow-y-auto">
                                <div className="p-3 flex items-center justify-between border-b border-gray-200">
                                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Chat history</span>
                                    <button
                                        type="button"
                                        onClick={() => setShowHistory(false)}
                                        className="text-xs text-gray-500 hover:text-gray-700"
                                    >
                                        Close
                                    </button>
                                </div>
                                <div className="max-h-[340px] overflow-y-auto">
                                    {loadingHistories ? (
                                        <div className="p-4 text-xs text-gray-500">Loading history...</div>
                                    ) : histories.length === 0 ? (
                                        <div className="p-4 text-xs text-gray-500">
                                            No past conversations yet. Start a new chat to see it here.
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-gray-200">
                                            {histories.map((h) => {
                                                const firstAssistant = (h.messages || []).find(m => m.role === 'assistant');
                                                const preview = firstAssistant?.content || (h.messages?.[0]?.content ?? 'Empty conversation');
                                                const title = h.title || 'Conversation';
                                                const date = h.updatedAt ? new Date(h.updatedAt).toLocaleString() : '';

                                                return (
                                                    <li key={h._id} className="group flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                        <div
                                                            onClick={() => handleSelectHistory(h)}
                                                            className="flex-1 min-w-0 cursor-pointer p-2"
                                                        >
                                                            <div className="text-xs font-semibold text-gray-800 truncate">
                                                                {title}
                                                            </div>
                                                            {date && (
                                                                <div className="text-[10px] text-gray-400">
                                                                    {date}
                                                                </div>
                                                            )}
                                                            <div className="mt-1 text-[11px] text-gray-600 line-clamp-2">
                                                                {preview}
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleDeleteHistory(e, h._id)}
                                                            className="p-2 ml-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                                            title="Delete conversation"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Messages */}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                            >
                                <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-100' : 'bg-indigo-100'}`}>
                                        {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-blue-600" /> : <Bot className="w-3.5 h-3.5 text-indigo-600" />}
                                    </div>
                                    <div
                                        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Streaming Message Bubbles */}
                        {isStreaming && (
                            <div className="flex justify-start animate-fade-in">
                                <div className="flex max-w-[85%] flex-row items-end gap-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-3.5 h-3.5 text-indigo-600" />
                                    </div>
                                    <div className="bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-none px-4 py-2.5 text-sm leading-relaxed shadow-sm">
                                        {streamingContent}
                                        <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-indigo-500 animate-pulse"></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Loading Indicator - Cool Text Version */}
                        {loading && (
                            <div className="flex justify-start animate-fade-in">
                                <div className="flex flex-row items-end gap-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-3.5 h-3.5 text-indigo-600" />
                                    </div>
                                    <div className="bg-white/80 border border-indigo-100 rounded-2xl rounded-bl-none p-4 shadow-sm backdrop-blur-sm">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                                                Knowledge AI is thinking
                                            </span>
                                            <div className="flex space-x-1">
                                                <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleStopGeneration}
                                            className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium underline decoration-red-300 hover:decoration-red-500 transition-all"
                                        >
                                            Stop Generating
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={user ? "Type your message..." : "Please log in..."}
                                disabled={loading || isStreaming || !user}
                                className="flex-grow px-5 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm transition-all placeholder-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={loading || isStreaming || !query.trim() || !user}
                                className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-110"
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <MessageCircle className="w-6 h-6 group-hover:animate-pulse" />
                )}
            </button>
        </div>
    );
};

export default ChatWidget;
