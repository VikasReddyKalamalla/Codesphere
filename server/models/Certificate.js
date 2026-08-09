const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course:         { type: mongoose.Schema.Types.ObjectId, ref: 'LearningPath', default: null }, // Null for custom uploads
    title:          { type: String, default: 'Custom Certificate' },
    issuer:         { type: String, default: 'Unknown' },
    certificateUrl: { type: String, required: true },
    issuedDate:     { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);
