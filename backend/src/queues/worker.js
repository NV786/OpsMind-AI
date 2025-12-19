import { Worker } from "bullmq";
import fs from "fs";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { embedText } from "../services/embedService.js";
import { storeVectors } from "../services/vectorStore.js";
import { setJobStatus } from "../services/jobStatusStore.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const worker = new Worker(
    "pdf-queue",
    async job => {
        const jobId = job.id;
        const { filePath, filename } = job.data;

        console.log(`[Job ${jobId}] Worker started processing: ${filename}`);

        await setJobStatus(jobId, "processing", {
            filename,
            progress: 0,
            message: "Starting AI analysis..."
        });

        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        try {
            // READS WITH GEMINI (Because it handles Scanned PDFs best)
            console.log(`[Job ${jobId}] Sending PDF to Gemini for Page Analysis...`);
            await setJobStatus(jobId, "processing", { progress: 20, message: "AI reading document..." });

            const pdfBuffer = fs.readFileSync(filePath);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            // SMART PROMPT: We ask Gemini to insert markers between pages
            const result = await model.generateContent([
                `You are a PDF extractor. Your job is to extract text exactly as it appears.
                 IMPORTANT: You must insert the separator "|||PAGE_NUMBER_X|||" at the start of every new page, where X is the page number.
                 Start the very first line with "|||PAGE_NUMBER_1|||".
                 Do not summarize. Just extract text.`,
                {
                    inlineData: {
                        data: pdfBuffer.toString("base64"),
                        mimeType: "application/pdf",
                    },
                },
            ]);

            const fullText = result.response.text();
            console.log(`[Job ${jobId}] AI extracted ${fullText.length} characters.`);

            // PARSE: Split text by the markers
            await setJobStatus(jobId, "processing", { progress: 40, message: "Structuring pages..." });

            // Split by our special tag
            const rawPages = fullText.split("|||PAGE_NUMBER_");

            // Clean up the split results
            const structuredDocs = [];

            rawPages.forEach(segment => {
                if (!segment.trim()) return; // Skip empty header

                // Extract the number
                const splitIndex = segment.indexOf("|||");
                if (splitIndex === -1) return; // Safety check

                const pageNum = parseInt(segment.substring(0, splitIndex).trim());
                const content = segment.substring(splitIndex + 3).trim();

                if (content.length > 0) {
                    structuredDocs.push({
                        pageContent: content,
                        metadata: { loc: { pageNumber: pageNum } }
                    });
                }
            });

            console.log(`[Job ${jobId}] Identified ${structuredDocs.length} pages via AI.`);

            if (structuredDocs.length === 0) {
                // Fallback if AI didn't output markers correctly
                console.log(`[Job ${jobId}] Page markers missing, treating as single page.`);
                structuredDocs.push({
                    pageContent: fullText,
                    metadata: { loc: { pageNumber: 1 } }
                });
            }

            // CHUNK: Split large pages into smaller vectors
            const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 800,
                chunkOverlap: 150
            });

            const chunkedDocs = await splitter.splitDocuments(structuredDocs);
            console.log(`[Job ${jobId}] Created ${chunkedDocs.length} chunks`);

            // EMBED & STORE
            await setJobStatus(jobId, "processing", { progress: 60, message: "Generating embeddings..." });

            const embeddings = [];
            for (let i = 0; i < chunkedDocs.length; i++) {
                const vector = await embedText(chunkedDocs[i].pageContent);
                embeddings.push(vector);

                if (i % 5 === 0) {
                    const percent = 60 + Math.floor((i / chunkedDocs.length) * 30);
                    await setJobStatus(jobId, "processing", { progress: percent });
                }
            }

            await storeVectors(chunkedDocs, embeddings, { filename });

            await setJobStatus(jobId, "completed", {
                progress: 100,
                message: "Processing complete!"
            });

            console.log(`[Job ${jobId}] Finished processing: ${filename}`);

        } catch (error) {
            console.error(`[Job ${jobId}] ERROR:`, error.message);
            await setJobStatus(jobId, "failed", { error: error.message });
        }
    },
    { connection: { host: "127.0.0.1", port: 6379 } }
);

console.log("PDF worker running");