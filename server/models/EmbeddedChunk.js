const mongoose = require('mongoose');

const embeddedChunkSchema = new mongoose.Schema({
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    embedding: {
        type: [Number], // Array of numbers for vector
        required: true
    },
    index: {
        type: Number,
        required: true
    }
});

const EmbeddedChunk = mongoose.model('EmbeddedChunk', embeddedChunkSchema);

module.exports = EmbeddedChunk;
