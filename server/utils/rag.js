// RAG Implementation using Voyage AI (Embeddings) and Groq Cloud (LLM)
// Replaces previous Gemini/Ollama hybrid setup

const fs = require('fs');
const pdfParse = require('pdf-parse');
// Note: Dependencies 'voyageai' and 'groq-sdk' must be installed
const { VoyageAIClient } = require('voyageai');
const Groq = require('groq-sdk');

// --- Configuration ---
// Voyage AI Client
// Ensure VOYAGE_API_KEY is set in your .env file
const voyageClient = new VoyageAIClient({
    apiKey: process.env.VOYAGE_API_KEY,
});

// Groq Client
// Ensure GROQ_API_KEY is set in your .env file
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Models
const VOYAGE_MODEL = process.env.VOYAGE_MODEL || 'voyage-2';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

// --- Helper Functions ---

const extractText = async (filePath, mimetype) => {
    console.log(`[rag.js] Extracting text from ${filePath} (${mimetype})`);
    const dataBuffer = fs.readFileSync(filePath);

    // pdf-parse normalization
    const pdf = typeof pdfParse === 'function' ? pdfParse : pdfParse.default;

    const looksLikePdf =
        filePath.toLowerCase().endsWith('.pdf') ||
        mimetype === 'application/pdf' ||
        dataBuffer.slice(0, 4).toString() === '%PDF';

    if (looksLikePdf) {
        if (!pdf) {
            console.error('[rag.js] pdf-parse library not found or invalid');
            return '';
        }
        try {
            const data = await pdf(dataBuffer);
            if (!data || !data.text) {
                console.warn('[rag.js] PDF parsed but no text content found');
                return '';
            }
            return data.text;
        } catch (e) {
            console.error('[rag.js] Error parsing PDF:', e);
            return '';
        }
    }

    // Binary check
    if (dataBuffer.includes(0)) {
        console.warn('[rag.js] File appears to be binary (contains null bytes) and is not a PDF. Returning empty string.');
        return '';
    }

    // Fallback: simple text
    const raw = dataBuffer.toString('utf-8');
    const clean = raw.replace(/[^\x09\x0A\x0D\x20-\x7E]+/g, ' ');
    return clean;
};

const chunkText = (text, maxLength = 1000) => {
    console.log(`[rag.js] Chunking text (len: ${text.length}, max: ${maxLength})`);
    const chunks = [];
    let currentChunk = '';
    const sentences = text.split('. ');

    for (const sentence of sentences) {
        const candidate = sentence + '. ';
        if ((currentChunk + candidate).length > maxLength) {
            if (currentChunk.trim().length > 0) chunks.push(currentChunk);
            currentChunk = candidate;
        } else {
            currentChunk += candidate;
        }
    }
    if (currentChunk) chunks.push(currentChunk);
    return chunks;
};

// --- Core RAG Functions ---

const generateEmbedding = async (text) => {
    if (!text || text.trim().length === 0) return [];

    try {
        const response = await voyageClient.embed({
            input: text,
            model: VOYAGE_MODEL,
        });

        // Voyage returns data array. We take the first one since we sent one input string.
        if (response.data && response.data.length > 0) {
            return response.data[0].embedding;
        }
        return [];
    } catch (error) {
        // Handle missing API Key specifically or generally
        console.error('[rag.js] Voyage AI embedding failed:', error.message);
        return [];
    }
};

const getChatResponse = async (query, context) => {
    try {
        const systemPrompt = `You are a helpful assistant. Use the provided context from the user's documents to answer questions.
If the answer is not in the context, say you don't know instead of guessing.

Context:
${context || '(no matching context found from documents)'}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: query }
            ],
            model: GROQ_MODEL,
        });

        return chatCompletion.choices[0]?.message?.content || "No response generated.";

    } catch (error) {
        console.error('[rag.js] Groq AI chat failed:', error.message);
        if (error.message.includes('API key')) {
            return "Configuration Error: Groq API Key is missing or invalid.";
        }
        return "I'm sorry, I'm having trouble calling the AI service right now.";
    }
};

module.exports = {
    extractText,
    chunkText,
    generateEmbedding,
    getChatResponse
};
