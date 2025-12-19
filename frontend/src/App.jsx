import React from 'react';
import UploadForm from './components/UploadForm';
import AskForm from './components/AskForm';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">OpsMind AI — Document Q&A</h1>

        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-3">Upload PDF</h2>
          <UploadForm />
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Ask a question</h2>
          <AskForm />
        </div>
      </div>
    </div>
  );
}
