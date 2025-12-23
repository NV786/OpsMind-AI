import React from 'react';
import { useAuth } from '../context/AuthContext';
import UploadForm from './UploadForm';
import AskForm from './AskForm';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">OpsMind AI</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {user?.username}!</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6">Document Q&A</h2>

        <div className="bg-white p-6 rounded shadow mb-6">
          <h3 className="text-xl font-semibold mb-3">Upload PDF</h3>
          <UploadForm />
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-3">Ask a question</h3>
          <AskForm />
        </div>
      </div>
    </div>
  );
}
