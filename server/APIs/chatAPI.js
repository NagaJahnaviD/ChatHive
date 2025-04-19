const express = require('express');
const chatApp = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const expressAsyncHandler = require('express-async-handler');
const { requireAuth } = require('@clerk/clerk-sdk-node'); // Clerk middleware

// Send a message
async function sendMessage(req, res) {
    const { senderId, recipientId, text, file } = req.body;
    try {
        // Check if both users exist
        const sender = await User.findById(senderId);
        const recipient = await User.findById(recipientId);

        if (!sender || !recipient) {
            return res.status(404).send({ message: 'Sender or recipient not found' });
        }

        // Create new message
        const newMessage = new Message({
            sender: senderId,
            recipient: recipientId,
            text,
            file,
        });

        const savedMessage = await newMessage.save();
        res.status(201).send({ message: 'Message sent successfully', payload: savedMessage });
    } catch (err) {
        res.status(500).send({ message: 'Error sending message', error: err.message });
    }
}

// Get messages between two users
async function getMessages(req, res) {
    const { senderId, recipientId } = req.query;

    try {
        const messages = await Message.find({
            $or: [
                { sender: senderId, recipient: recipientId },
                { sender: recipientId, recipient: senderId },
            ],
        }).populate('sender recipient', 'username firstName lastName');

        res.status(200).send({ messages });
    } catch (err) {
        res.status(500).send({ message: 'Error fetching messages', error: err.message });
    }
}

// Get all messages for a user
async function getAllMessages(req, res) {
    const userId = req.params.userId;

    try {
        const messages = await Message.find({
            $or: [{ sender: userId }, { recipient: userId }],
        }).populate('sender recipient', 'username firstName lastName');

        res.status(200).send({ messages });
    } catch (err) {
        res.status(500).send({ message: 'Error fetching all messages', error: err.message });
    }
}


// Routes
chatApp.post('/message', expressAsyncHandler(sendMessage)); // Send message
chatApp.get('/messages', expressAsyncHandler(getMessages)); // Get messages between users
chatApp.get('/messages/:userId', expressAsyncHandler(getAllMessages)); // Get all messages for a user

module.exports = chatApp;
