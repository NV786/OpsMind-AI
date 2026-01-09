import ChatHistory from '../models/ChatHistory.js';
import { v4 as uuidv4 } from 'uuid';

// Save a message to chat history
export const saveMessage = async (req, res) => {
    try {
        const { conversationId, role, content, sources } = req.body;
        const userId = req.user._id;

        if (!role || !content) {
            return res.status(400).json({ error: "Role and content are required" });
        }

        let conversation;
        
        if (conversationId) {
            // Find existing conversation
            conversation = await ChatHistory.findOne({ userId, conversationId });
        }

        if (!conversation) {
            // Create new conversation
            const newConversationId = conversationId || uuidv4();
            
            // Generate title from first user message
            const title = role === 'user' 
                ? content.substring(0, 50) + (content.length > 50 ? '...' : '')
                : 'New Conversation';

            conversation = new ChatHistory({
                userId,
                conversationId: newConversationId,
                title,
                messages: []
            });
        }

        // Add message
        conversation.messages.push({
            role,
            content,
            sources: sources || [],
            timestamp: new Date()
        });

        conversation.lastMessageAt = new Date();
        await conversation.save();

        res.json({
            success: true,
            conversationId: conversation.conversationId,
            message: conversation.messages[conversation.messages.length - 1]
        });

    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ error: "Failed to save message" });
    }
};

// Get all conversations for a user
export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const { limit = 20, skip = 0 } = req.query;

        const conversations = await ChatHistory.find({ userId })
            .select('conversationId title lastMessageAt messages')
            .sort({ lastMessageAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .lean();

        // Add message count and preview
        const conversationsWithPreview = conversations.map(conv => ({
            conversationId: conv.conversationId,
            title: conv.title,
            lastMessageAt: conv.lastMessageAt,
            messageCount: conv.messages.length,
            lastMessage: conv.messages.length > 0 
                ? conv.messages[conv.messages.length - 1].content.substring(0, 100)
                : ''
        }));

        res.json({
            success: true,
            conversations: conversationsWithPreview,
            total: await ChatHistory.countDocuments({ userId })
        });

    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ error: "Failed to fetch conversations" });
    }
};

// Get a specific conversation by ID
export const getConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;

        const conversation = await ChatHistory.findOne({ userId, conversationId });

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        res.json({
            success: true,
            conversation: {
                conversationId: conversation.conversationId,
                title: conversation.title,
                messages: conversation.messages,
                createdAt: conversation.createdAt,
                lastMessageAt: conversation.lastMessageAt
            }
        });

    } catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).json({ error: "Failed to fetch conversation" });
    }
};

// Delete a conversation
export const deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;

        const result = await ChatHistory.deleteOne({ userId, conversationId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        res.json({
            success: true,
            message: "Conversation deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting conversation:", error);
        res.status(500).json({ error: "Failed to delete conversation" });
    }
};

// Update conversation title
export const updateConversationTitle = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { title } = req.body;
        const userId = req.user._id;

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const conversation = await ChatHistory.findOneAndUpdate(
            { userId, conversationId },
            { title },
            { new: true }
        );

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        res.json({
            success: true,
            conversation: {
                conversationId: conversation.conversationId,
                title: conversation.title
            }
        });

    } catch (error) {
        console.error("Error updating conversation title:", error);
        res.status(500).json({ error: "Failed to update conversation title" });
    }
};
