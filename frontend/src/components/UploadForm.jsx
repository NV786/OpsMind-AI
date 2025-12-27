
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
      alert('Please select a PDF file');
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
      setStatus(`✓ Document enqueued: ${res.data.jobId}`);
      
      // Reset after success
      setTimeout(() => {
        setFile(null);
        setIsUploading(false);
        setUploadProgress(0);
        setStatus('');
      }, 3000);
      
    } catch (err) {
      setStatus('✗ Upload failed: ' + err.message);
      setIsUploading(false);
      setUploadProgress(0);
    }
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setStatus('');
    } else {
      alert('Please select a valid PDF file');
      e.target.value = '';
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Drop Zone */}
        <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          file 
            ? 'border-blue-400 bg-blue-50/50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
        }`}>
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
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                file 
                  ? 'bg-gradient-to-br from-green-100 to-blue-100' 
                  : 'bg-gradient-to-br from-blue-100 to-purple-100'
              }`}>
                <svg className={`w-8 h-8 ${file ? 'text-green-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="mb-2">
                <p className="text-lg font-medium text-gray-900">
                  {file ? (
                    <>
                      <span className="text-green-600">✓</span> {file.name}
                    </>
                  ) : 'Choose a PDF file'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'or drag and drop here'}
                </p>
              </div>
              <span className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 inline-block ${
                isUploading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-sm'
              }`}>
                {file ? 'Change File' : 'Browse Files'}
              </span>
            </div>
          </label>
        </div>

        {/* Progress Bar */}
        {isUploading && (
          <div className="space-y-2 animate-pulse">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Uploading document...</span>
              <span className="font-medium text-blue-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Status & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Status Message */}
          <div className="flex items-center gap-2 min-h-[24px]">
            {status && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                status.includes('✓') 
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : status.includes('✗')
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {status.includes('Uploading') && (
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                {status}
              </div>
            )}
          </div>
          
          {/* Upload Button */}
          <button
            type="submit"
            disabled={!file || isUploading}
            className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm ${
              !file || isUploading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow transform hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {isUploading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Document
              </>
            )}
          </button>
        </div>
      </form>

      {/* Help Text */}
      <div className="text-xs text-gray-500 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
        <p className="font-medium mb-2 text-gray-700">📋 Supported Features:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>PDF documents up to 50MB</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>AI-powered text extraction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Secure encrypted processing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Multi-page document support</span>
          </div>
        </div>
      </div>
    </div>
  );
}