const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
  content: mongoose.Schema.Types.Mixed,
  title: String,
  editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
}, { _id: true });

const noteSchema = new mongoose.Schema({
  title: String,

  content: {
    text: String,
    type: { type: String, enum: ['plain', 'checklist', 'table'], default: 'plain', required: true }

  },
  activityLog: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: String, // 'created', 'updated', 'shared'
    timestamp: { type: Date, default: Date.now },
    metadata: mongoose.Schema.Types.Mixed
  }],

  attachments: [{
    url: String,
    type: String,
    name: String
  }],

  checklist: [{
    text: String,
    completed: Boolean
  }],

  table: {
    headers: [String],
    rows: [[String]] // 2D array
  },

  tags: [String],

  history: [versionSchema],  // Use the versionSchema here

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  collaborators: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    permission: {
      type: String,
      enum: ['view', 'edit', 'admin'],
      default: 'view'
    }
  }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  shareLink: {
    token: String,
    expiresAt: Date,
    permission: String
  },


});

noteSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const NoteModel = mongoose.model('Note', noteSchema);
module.exports = NoteModel;
