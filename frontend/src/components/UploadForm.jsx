import React, { useState } from 'react';
import axios from 'axios';

export default function UploadForm() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        if (!file) {
            alert('Please select a PDF file');
            return;
        }
        const fd = new FormData();
        fd.append('file', file);

        try {
            setStatus('Uploading...');
            const res = await axios.post('http://localhost:5000/api/ingest', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus(`Enqueued job: ${res.data.jobId}`);
        } catch (err) {
            setStatus('Upload failed: ' + err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <input type="file" className='px-4 py-2 bg-blue-600 text-white rounded' accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Upload</button>
            <div className="text-sm text-gray-700">{status}</div>
        </form>
    );
}
