const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  recipient: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  text: String,
  file: String,
  createdAt: { type: Date, default: Date.now },
});

const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;