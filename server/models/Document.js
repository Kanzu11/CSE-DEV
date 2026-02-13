const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    // For file uploads this is the file path on disk.
    // For pasted text documents this can be omitted.
    path: {
        type: String,
    },
    size: {
        type: Number
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'indexed', 'failed'],
        default: 'pending'
    },
    vectorId: {
        type: String,
        // ID reference in the Vector Database if applicable
    },
    metadata: {
        type: Map,
        of: String
    }
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
