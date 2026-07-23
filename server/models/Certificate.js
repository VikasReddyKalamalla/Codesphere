const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course:         { type: mongoose.Schema.Types.ObjectId, ref: 'LearningPath', required: true },
    certificateUrl: { type: String, required: true },
    issuedDate:     { type: Date, default: Date.now },
  }
);

module.exports = mongoose.model('Certificate', certificateSchema);
