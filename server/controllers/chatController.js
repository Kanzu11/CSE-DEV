const EmbeddedChunk = require('../models/EmbeddedChunk');
const ChatHistory = require('../models/ChatHistory');
const { generateEmbedding, getChatResponse } = require('../utils/rag');

// Helper to calculate cosine similarity
const cosineSimilarity = (vecA, vecB) => {
    if (!vecA || !vecB || vecA.length !== vecB.length) {
        return -1; // Mismatch dimension or invalid vector
    }
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// @desc    Chat with AI
// @route   POST /api/chat
// @access  Private
const chat = async (req, res) => {
    const { message, historyId } = req.body;
    const user = req.user._id;

    try {
        // 1. Generate embedding for query
        const queryEmbedding = await generateEmbedding(message);

        // 2. Fetch all chunks (Naive retrieval for small scale)
        // In production, use Vector Search (Atlas Search, Pinecone, etc.)
        const allChunks = await EmbeddedChunk.find({});

        // 3. Calculate similarity and rank
        const rankedChunks = allChunks.map(chunk => ({
            ...chunk.toObject(),
            score: cosineSimilarity(queryEmbedding, chunk.embedding)
        })).sort((a, b) => b.score - a.score).slice(0, 3); // Top 3

        // 4. Construct Context
        const context = rankedChunks.map(chunk => chunk.content).join('\n\n');

        // 5. Get LLM Response
        const response = await getChatResponse(message, context);

        // 6. Save Chat History
        let chatHistory;
        if (historyId) {
            chatHistory = await ChatHistory.findById(historyId);
        }

        if (!chatHistory) {
            chatHistory = await ChatHistory.create({
                user,
                messages: []
            });
        }

        chatHistory.messages.push({ role: 'user', content: message });
        chatHistory.messages.push({ role: 'assistant', content: response });
        await chatHistory.save();

        res.json({
            response,
            historyId: chatHistory._id,
            sources: rankedChunks.map(c => c.document) // Return source doc IDs
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Chat processing failed' });
    }
};

// @desc    Get User Chat History
// @route   GET /api/chat
// @access  Private
const getHistory = async (req, res) => {
    try {
        const history = await ChatHistory.find({ user: req.user._id }).sort({ updatedAt: -1 });
        res.json(history);
    } catch (error) {
        console.error('Error in chat controller:', error);
        res.status(500).json({ error: 'Failed to process chat message', details: error.message });
    }
};

// @desc    Delete Chat History
// @route   DELETE /api/chat/:id
// @access  Private
const deleteHistory = async (req, res) => {
    try {
        const history = await ChatHistory.findById(req.params.id);

        if (!history) {
            return res.status(404).json({ message: 'Chat history not found' });
        }

        // Ensure user owns the history
        if (history.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await ChatHistory.findByIdAndDelete(req.params.id);
        res.json({ message: 'Chat history deleted' });
    } catch (error) {
        console.error('Error deleting chat history:', error);
        res.status(500).json({ message: 'Failed to delete chat history' });
    }
};

module.exports = {
    chat,
    getHistory,
    deleteHistory
};
