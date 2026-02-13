import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { Upload, Trash2, FileText, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [loadingDocs, setLoadingDocs] = useState(true);
    const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error'

    // State for pasted text documents
    const [textTitle, setTextTitle] = useState('');
    const [textContent, setTextContent] = useState('');
    const [textUploading, setTextUploading] = useState(false);
    const [textUploadStatus, setTextUploadStatus] = useState(null); // 'success' | 'error'

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/documents');
            setDocuments(response.data);
        } catch (error) {
            console.error('Failed to fetch documents', error);
        } finally {
            setLoadingDocs(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setUploadStatus(null);
    };

    const handleTextSubmit = async (e) => {
        e.preventDefault();
        if (!textTitle.trim() || !textContent.trim()) return;

        setTextUploading(true);
        // setTextUploadStatus(null); // Removed
        try {
            await api.post('/documents/text', {
                title: textTitle.trim(),
                content: textContent,
            });
            // setTextUploadStatus('success'); // Removed
            toast.success('Text saved successfully!');
            setTextTitle('');
            setTextContent('');
            await fetchDocuments();
        } catch (error) {
            console.error('Text upload failed', error);
            // setTextUploadStatus('error'); // Removed
            toast.error('Failed to save text. Please try again.');
        } finally {
            setTextUploading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        // Must match multer.single('file') on the server
        formData.append('file', file);

        setUploading(true);
        // setUploadStatus(null); // Removed
        try {
            // Server expects POST /api/documents with field name "file"
            await api.post('/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // setUploadStatus('success'); // Removed
            toast.success('Document uploaded successfully!');
            setFile(null);
            // Reset file input
            document.getElementById('file-upload').value = '';
            fetchDocuments();
        } catch (error) {
            console.error('Upload failed', error);
            // setUploadStatus('error'); // Removed
            toast.error('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = (id) => {
        toast.custom((t) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                <Trash2 className="h-6 w-6 text-red-600" aria-hidden="true" />
                            </div>
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                Delete Document
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                Are you sure you want to delete this document? This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col border-l border-gray-200">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await api.delete(`/documents/${id}`);
                                toast.success('Document deleted');
                                setDocuments((prev) => prev.filter((doc) => doc._id !== id));
                            } catch (error) {
                                console.error('Delete failed', error);
                                toast.error('Failed to delete document');
                            }
                        }}
                        className="w-full border-b border-gray-200 rounded-tr-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="w-full rounded-br-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 5000,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:flex md:items-center md:justify-between"
                >
                    <div className="flex-1 min-w-0">
                        <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate">
                            Admin Dashboard
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage knowledge base documents and monitor system status.
                        </p>
                    </div>
                </motion.div>

                {/* Upload Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-200"
                >
                    <div className="p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center mb-4">
                            <Upload className="w-5 h-5 mr-2 text-blue-600" />
                            Add Knowledge
                        </h3>

                        <div className="md:grid md:grid-cols-2 md:gap-6">
                            {/* File upload */}
                            <div className="flex-1 max-w-xl mb-6 md:mb-0">
                                <label
                                    htmlFor="file-upload"
                                    className={`flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <span className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.txt,.doc,.docx" />
                                            </span>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PDF, DOCX, TXT up to 10MB
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Pasted text */}
                            <div className="mt-4 md:mt-0 flex-1">
                                <form onSubmit={handleTextSubmit} className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={textTitle}
                                        onChange={(e) => setTextTitle(e.target.value)}
                                        placeholder="e.g. Meeting notes, FAQ, article…"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        disabled={textUploading}
                                        required
                                    />

                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Paste text
                                    </label>
                                    <textarea
                                        rows={6}
                                        value={textContent}
                                        onChange={(e) => setTextContent(e.target.value)}
                                        placeholder="Paste any text content here to add it to your knowledge base…"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                                        disabled={textUploading}
                                        required
                                    />

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={textUploading}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            {textUploading ? (
                                                <>
                                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Save Text'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* File upload status / messages */}
                            <div className="mt-4 md:mt-4 flex-1 col-span-2 md:col-span-2">
                                {file && (
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                                        <div className="flex items-center">
                                            <FileText className="h-5 w-5 text-blue-600 mr-2" />
                                            <span className="text-sm font-medium text-blue-900 truncate">{file.name}</span>
                                        </div>
                                        <div className="mt-2 flex justify-end">
                                            <button
                                                onClick={handleUpload}
                                                disabled={uploading}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                            >
                                                {uploading ? (
                                                    <>
                                                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    'Start Upload'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Documents List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white shadow-sm rounded-2xl border border-gray-200 overflow-hidden"
                >
                    <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Knowledge Base ({documents.length})
                        </h3>
                        <button onClick={fetchDocuments} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                            <RefreshCw className={`w-5 h-5 ${loadingDocs ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {loadingDocs ? (
                        <div className="p-12 flex justify-center">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No documents uploaded yet.
                        </div>
                    ) : (
                        <ul role="list" className="divide-y divide-gray-200">
                            {documents.map((doc) => (
                                <li key={doc._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <FileText className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {doc.filename || 'Untitled document'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doc.status === 'indexed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : doc.status === 'failed'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                            >
                                                {doc.status === 'indexed'
                                                    ? 'Indexed'
                                                    : doc.status === 'failed'
                                                        ? 'Failed'
                                                        : 'Processing'}
                                            </span>
                                            <button
                                                onClick={() => handleDelete(doc._id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete document"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
