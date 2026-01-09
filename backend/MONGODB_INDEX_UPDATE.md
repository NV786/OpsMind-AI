# 🔧 MongoDB Atlas Vector Index Update

## Why This is Needed

To enable filtering by `userId` in vector search, MongoDB Atlas needs to know about this field in the vector index.

## Steps to Update Your Vector Index

### 1. Log into MongoDB Atlas
Go to: https://cloud.mongodb.com

### 2. Navigate to Your Cluster
- Select your cluster
- Click "Browse Collections"
- Find the `vectors` collection

### 3. Go to Atlas Search
- Click on the "Search" tab
- Find your index named `vector_index`
- Click "Edit"

### 4. Update the Index Definition

**Replace the existing JSON with this:**

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 384,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "userId"
    }
  ]
}
```

### 5. Save Changes
- Click "Save Changes"
- Wait for the index to rebuild (usually takes 1-2 minutes)

## What This Does

- **Before:** Search looked at ALL documents
- **After:** Search can filter by `userId` field, isolating each user's documents

## Verify It Works

After updating:
1. Restart your backend and worker
2. Upload a new PDF
3. Ask questions - you should only get answers from YOUR documents
4. Create another user account and upload different PDFs - they should NOT see your documents

---

**Note:** If you have old documents without `userId`, run the cleanup script:
```bash
cd backend
node scripts/cleanup-vectors.js
```
