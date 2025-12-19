import React, { useState } from 'react';
import axios from 'axios';

export default function AskForm() {
    const [q, setQ] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleAsk(e) {
        e.preventDefault();
        if (!q) return;
        setLoading(true);
        setResponse(null);
        try {
            const res = await axios.post('http://localhost:5000/api/chat', { question: q });
            setResponse(res.data);
        } catch (err) {
            setResponse({ error: err.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <form onSubmit={handleAsk} className="flex gap-3">
                <input 
                    value={q} 
                    onChange={e => setQ(e.target.value)} 
                    className="flex-1 p-2 border" 
                    placeholder="Ask about uploaded PDFs..." 
                />
                <button className="px-4 py-2 bg-green-600 text-white rounded">Ask</button>
            </form>

            <div className="mt-4">
                {loading && <div>Loading…</div>}
                
                {response && response.error && (
                    <div className="text-red-600">{response.error}</div>
                )}
                
                {response && response.answer && (
                    <div className="bg-gray-50 p-4 rounded">
                        <h3 className="font-semibold">Answer</h3>
                        <div className="mt-2 whitespace-pre-wrap">{response.answer}</div>

                        {response.sources && response.sources.length > 0 && (
                            <>
                                <h4 className="mt-3 font-semibold text-sm text-gray-600">Sources:</h4>
                                <ul className="list-disc ml-6 text-sm text-gray-500">
                                    {response.sources.map((source, i) => (
                                        <li key={i}>
                                            <span className="font-medium text-gray-800">
                                                {source.filename}
                                            </span> 
                                            <span className="text-gray-600 ml-1">
                                                (Page No. : {source.page})
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}