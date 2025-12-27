// import React from 'react';
// import { useAuth } from '../context/AuthContext';
// import UploadForm from './UploadForm';
// import AskForm from './AskForm';

// export default function Dashboard() {
//   const { user, logout } = useAuth();

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <nav className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16 items-center">
//             <h1 className="text-xl font-bold">OpsMind AI</h1>
//             <div className="flex items-center gap-4">
//               <span className="text-gray-700">Welcome, {user?.username}!</span>
//               <button
//                 onClick={logout}
//                 className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-4xl mx-auto p-8">
//         <h2 className="text-3xl font-bold mb-6">Document Q&A</h2>

//         <div className="bg-white p-6 rounded shadow mb-6">
//           <h3 className="text-xl font-semibold mb-3">Upload PDF</h3>
//           <UploadForm />
//         </div>

      
//       </div>
//     </div>
//   );
// }

import React from 'react';
import { useAuth } from '../context/AuthContext';
import UploadForm from './UploadForm';
import AskForm from './AskForm';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">OM</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  OpsMind AI
                </h1>
                <p className="text-xs text-gray-500">Intelligent Document Analysis</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.username}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow relative"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user?.username}</span>!
          </h2>
          <p className="text-gray-600">
            Upload your documents and ask questions about them using AI.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upload Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Upload Document</h3>
                  <p className="text-sm text-gray-600">Upload PDF files for AI processing</p>
                </div>
              </div>
              <UploadForm />
            </div>
          </div>

          {/* Ask Form Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Ask Questions</h3>
                  <p className="text-sm text-gray-600">Get answers from your uploaded documents</p>
                </div>
              </div>
              <AskForm />
            </div>
          </div>
        </div>
        
      </div>

      {/* Footer Note */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <p className="text-center text-sm text-gray-500">
          Secure AI-powered document analysis • All uploads are encrypted and processed securely
        </p>
      </div>
    </div>
  );
}