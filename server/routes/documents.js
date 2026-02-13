const express = require('express');
const router = express.Router();
const {
    uploadDocument,
    uploadTextDocument,
    getDocuments,
    deleteDocument
} = require('../controllers/documentController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .post(protect, admin, upload.single('file'), uploadDocument)
    .get(protect, admin, getDocuments);

// Paste raw text as a document
router.route('/text')
    .post(protect, admin, uploadTextDocument);

router.route('/:id')
    .delete(protect, admin, deleteDocument);

module.exports = router;
