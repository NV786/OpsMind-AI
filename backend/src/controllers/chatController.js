import { findSimilarDocuments } from "../services/ragService.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithPDF = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: "Question is required" });
        }

        console.log(`User asked: "${question}"`);

        // Finding relevant chunks
        const relevantDocs = await findSimilarDocuments(question);

        if (!relevantDocs || relevantDocs.length === 0) {
            return res.json({
                answer: "I checked your uploaded documents, but I couldn't find any information relevant to your question.",
                sources: []
            });
        }

        // Preparing Context
        const context = relevantDocs.map(doc => doc.text).join("\n\n---\n\n");

        // Generating Answer
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are a smart AI assistant. Answer the user's question based ONLY on the provided Context below.
        CONTEXT:
        ${context}
        USER QUESTION:
        ${question}
        `;

        const result = await model.generateContent(prompt);
        const answer = result.response.text();

        // Filtering Duplicates 
        const uniqueSourcesMap = new Map();

        relevantDocs.forEach(doc => {
            const filename = doc.filename || "Unknown File";
            const page = doc.page || 1;
            const uniqueKey = `${filename}-${page}`; // Creates a unique ID 

            if (!uniqueSourcesMap.has(uniqueKey)) {
                uniqueSourcesMap.set(uniqueKey, { filename, page });
            }
        });

        // Converting the Map back to a list
        const uniqueSources = Array.from(uniqueSourcesMap.values());

        res.json({
            answer,
            sources: uniqueSources
        });

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Failed to process your question." });
    }
};