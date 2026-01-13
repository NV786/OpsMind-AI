import { pipeline } from '@xenova/transformers';

// We use a singleton variable so we don't reload the model for every chunk
let extractor = null;

export async function embedText(text) {
    if (!text) return [];

    try {
        // Load the model if it's not ready yet
        // On the first run, this will download the model
        if (!extractor) {
            console.log("Loading local embedding model (Xenova/all-MiniLM-L6-v2)...");
            extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            console.log("Model loaded successfully!");
        }

        // Generate embedding locally (CPU)
        const output = await extractor(text, { pooling: 'mean', normalize: true });

        // Return the array of numbers
        return Array.from(output.data);

    } catch (error) {
        console.error("Local Embedding Error:", error.message);
        throw error;
    }
}