const express = require('express');
const chatApp = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const expressAsyncHandler = require('express-async-handler');

// Send a message
async function sendMessage(req, res) {
  const { senderId, recipientId, text } = req.body;
  console.log("in send")

  try {
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      return res.status(404).send({ message: 'Sender or recipient not found' });
    }

    const newMessage = new Message({
      sender: senderId,
      recipient: recipientId,
      text,
    });
    const savedMessage = await newMessage.save();
    res.status(201).send({ message: 'Message sent successfully', payload: savedMessage });
    // console.log("sent")
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
    }).sort({ createdAt: 1 }).populate('sender recipient', 'username firstName lastName');

    res.status(200).send({ messages });
  } catch (err) {
    res.status(500).send({ message: 'Error fetching messages', error: err.message });
  }
}

// Routes
chatApp.post('/message', expressAsyncHandler(sendMessage));
chatApp.get('/messages', expressAsyncHandler(getMessages));

module.exports = chatApp;
