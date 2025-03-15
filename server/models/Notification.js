const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info',
  },
  read: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  link: String,
  category: {
    type: String,
    enum: ['user', 'client', 'role', 'team', 'brand', 'system', null],
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);