const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Socket.io room identifier (e.g. "channel:6adee...", "direct:6adee...", "community:6adee...")
    room: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    // Scope references
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community',
      index: true,
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      index: true,
    },
    directChat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DirectChat',
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },
    type: {
      type: String,
      enum: ['text', 'code', 'image', 'file', 'system', 'poll'],
      default: 'text',
      index: true,
    },
    // Code snippet payload with syntax highlighting & IDE runner metadata
    codeSnippet: {
      language: { type: String, default: 'javascript', trim: true },
      code: { type: String, default: '' },
      title: { type: String, default: '', trim: true },
    },
    // Media & file attachments
    attachments: [
      {
        url: { type: String, trim: true },
        name: { type: String, trim: true },
        size: { type: Number, default: 0 },
        mimeType: { type: String, default: '' },
      },
    ],
    // Legacy single file compatibility
    fileUrl: { type: String, trim: true, maxlength: 500 },
    fileName: { type: String, trim: true, maxlength: 200 },

    // WhatsApp-style Delivery Status & Receipts
    // sent = 1 tick, delivered = 2 ticks, read = 2 blue ticks
    deliveryStatus: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
      index: true,
    },
    deliveredTo: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        deliveredAt: { type: Date, default: Date.now },
      },
    ],
    readBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        readAt: { type: Date, default: Date.now },
      },
    ],

    // Mentions & Reactions
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    reactions: {
      type: Map,
      of: [mongoose.Schema.Types.ObjectId],
      default: {},
    },

    // Starred messages (WhatsApp starred/saved)
    starredBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // Threading & Parent Quotes
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    threadCount: {
      type: Number,
      default: 0,
    },

    // Pins & Editing
    isPinned: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// High-performance compound indexes for high-concurrency WhatsApp & Discord message queries
messageSchema.index({ room: 1, createdAt: -1 });
messageSchema.index({ channel: 1, createdAt: -1 });
messageSchema.index({ directChat: 1, createdAt: -1 });
messageSchema.index({ community: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ room: 1, isPinned: 1 });
messageSchema.index({ content: 'text' });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
