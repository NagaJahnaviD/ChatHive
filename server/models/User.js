const mongoose = require('mongoose');

const User = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true},
  lastName: { type: String, required: true},
  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  profilePictureUrl: { type: String, default: '' },
  status: { type: String, enum: ['online', 'offline', 'busy', 'away'], default: 'offline' },
  lastSeen: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {"strict":"throw"});

module.exports = mongoose.model('User', User);