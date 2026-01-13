import React, { useState } from 'react';
import axios from 'axios';

export default function UploadForm() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!file) {
            setStatus('Please select a PDF file');
            return;
        }
        
        const fd = new FormData();
        fd.append('file', file);

        try {
            setIsUploading(true);
            setStatus('Uploading...');
            setUploadProgress(30);

            const res = await axios.post('http://localhost:5000/api/ingest', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                }
            });
            
            setUploadProgress(100);
            setStatus(`✓ Document uploaded successfully: ${res.data.jobId}`);
            
            setTimeout(() => {
                setFile(null);
                setIsUploading(false);
                setUploadProgress(0);
                setStatus('');
            }, 3000);
            
        } catch (err) {
            setStatus('✗ Upload failed: ' + (err.response?.data?.message || err.message));
            setIsUploading(false);
            setUploadProgress(0);
        }
    }

    function handleFileChange(e) {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type === 'application/pdf') {
                if (selectedFile.size <= 50 * 1024 * 1024) { // 50MB limit
                    setFile(selectedFile);
                    setStatus('');
                } else {
                    setStatus('✗ File size must be less than 50MB');
                    e.target.value = '';
                }
            } else {
                setStatus('✗ Please select a valid PDF file');
                e.target.value = '';
            }
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            if (droppedFile.type === 'application/pdf') {
                if (droppedFile.size <= 50 * 1024 * 1024) {
                    setFile(droppedFile);
                    setStatus('');
                } else {
                    setStatus('✗ File size must be less than 50MB');
                }
            } else {
                setStatus('✗ Please drop a valid PDF file');
            }
        }
    }

    return (
        <div className="space-y-8">
            {/* Drag & Drop Zone */}
            <div 
                className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${file ? 'border-blue-400/50 bg-blue-500/5' : 'border-gray-600 hover:border-blue-400/50 hover:bg-gray-800/30'}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    disabled={isUploading}
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                    <div className="flex flex-col items-center justify-center">
                        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-8 ${file ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20' : 'bg-gradient-to-r from-gray-800 to-gray-900'}`}>
                            {file ? (
                                <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            )}
                        </div>
                        <div className="mb-8">
                            <p className="text-xl font-medium mb-3">
                                {file ? (
                                    <span className="text-green-400">✓ {file.name}</span>
                                ) : (
                                    <span>Drag & drop or click to upload</span>
                                )}
                            </p>
                            <p className="text-gray-400">
                                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document` : 'Supports PDF files up to 50MB'}
                            </p>
                        </div>
                        <span className={`px-10 py-4 rounded-xl font-medium transition-all duration-200 inline-block ${isUploading ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-500/30 hover:border-blue-400/50'}`}>
                            {file ? 'Choose Different File' : 'Browse Files'}
                        </span>
                        {!file && (
                            <p className="text-sm text-gray-500 mt-6">Drop your PDF file here or click to browse</p>
                        )}
                    </div>
                </label>
            </div>

            {/* Progress Bar */}
            {isUploading && (
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Processing document...</span>
                        <span className="font-medium text-blue-400">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Extracting text and preparing for AI analysis...</span>
                    </div>
                </div>
            )}

            {/* Status & Actions */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Status Message */}
                <div className="flex-1 min-w-0">
                    {status && (
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${status.includes('✓') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : status.includes('✗') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                            {status.includes('Uploading') && (
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            )}
                            <span className="truncate">{status}</span>
                        </div>
                    )}
                </div>
                
                {/* Upload Button */}
                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!file || isUploading}
                    className={`px-10 py-4 font-medium rounded-xl transition-all duration-200 flex items-center gap-3 whitespace-nowrap ${!file || isUploading ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0'}`}
                >
                    {isUploading ? (
                        <>
                            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Uploading...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Process Document
                        </>
                    )}
                </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-gray-800/50">
                <div className="flex items-start gap-4 p-5 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium mb-1">AI Processing</p>
                        <p className="text-sm text-gray-400">Smart text extraction and analysis</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium mb-1">Secure & Private</p>
                        <p className="text-sm text-gray-400">Encrypted processing and storage</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium mb-1">Multi-page Support</p>
                        <p className="text-sm text-gray-400">Handle documents of any length</p>
                    </div>
                </div>
            </div>

            {/* File Requirements */}
            <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/50">
                <p className="font-medium mb-3 text-gray-300">📋 File Requirements</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-400">PDF format only</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-400">Max 50MB file size</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-400">English text preferred</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-400">Scanned PDFs supported</span>
                    </div>
                </div>
            </div>
        </div>
    );
}