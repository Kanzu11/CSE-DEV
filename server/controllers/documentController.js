const Document = require('../models/Document');
const EmbeddedChunk = require('../models/EmbeddedChunk');
const fs = require('fs');
const path = require('path');
const { extractText, generateEmbedding, chunkText } = require('../utils/rag');

// @desc    Upload a document
// @route   POST /api/documents
// @access  Private/Admin
const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // 1. Create Document Entry
        const doc = await Document.create({
            filename: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            status: 'processing'
        });

        // 2. Process in background (Conceptually, for now we do it inline or next tick)
        // In a real app, use a queue like Bull
        (async () => {
            try {
                const text = await extractText(req.file.path, req.file.mimetype);

                if (!text || text.trim().length === 0) {
                    throw new Error('No text content extracted from document');
                }

                const chunks = chunkText(text);

                for (let i = 0; i < chunks.length; i++) {
                    const embedding = await generateEmbedding(chunks[i]);
                    await EmbeddedChunk.create({
                        document: doc._id,
                        content: chunks[i],
                        embedding,
                        index: i
                    });
                }

                doc.status = 'indexed';
                await doc.save();
                console.log(`Document ${doc.filename} indexed successfully.`);
            } catch (error) {
                console.error(`Error processing document ${doc.filename}:`, error);
                doc.status = 'failed';
                await doc.save();
            }
        })();

        res.status(201).json(doc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload raw text as a document
// @route   POST /api/documents/text
// @access  Private/Admin
const uploadTextDocument = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        // 1. Create Document Entry (no file path)
        const doc = await Document.create({
            filename: title,
            size: content.length,
            status: 'processing',
        });

        // 2. Process text in background (same pipeline as files)
        (async () => {
            try {
                const chunks = chunkText(content);

                for (let i = 0; i < chunks.length; i++) {
                    const embedding = await generateEmbedding(chunks[i]);
                    await EmbeddedChunk.create({
                        document: doc._id,
                        content: chunks[i],
                        embedding,
                        index: i,
                    });
                }

                doc.status = 'indexed';
                await doc.save();
                console.log(`Text document ${doc.filename} indexed successfully.`);
            } catch (error) {
                console.error(`Error processing text document ${doc.filename}:`, error);
                doc.status = 'failed';
                await doc.save();
            }
        })();

        res.status(201).json(doc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private/Admin
const getDocuments = async (req, res) => {
    try {
        const documents = await Document.find({}).sort({ uploadDate: -1 });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private/Admin
const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (document) {
            const filePath = path.resolve(document.path);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            // Delete chunks
            await EmbeddedChunk.deleteMany({ document: document._id });
            await document.deleteOne();

            res.json({ message: 'Document removed' });
        } else {
            res.status(404).json({ message: 'Document not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadDocument,
    uploadTextDocument,
    getDocuments,
    deleteDocument
};
