const mongoose = require('mongoose');

const eventCategorySchema = new mongoose.Schema(
  {
    // ─── Core Info ────────────────────────────────────────────────────────────
    name: {
      type:      String,
      required:  [true, 'Category name is required'],
      unique:    true,
      trim:      true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    description: {
      type:      String,
      default:   '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    icon:     { type: String, default: '🗓️' },
    color:    { type: String, default: '#6366f1' },
    isActive: { type: Boolean, default: true },

    // ─── Stats ────────────────────────────────────────────────────────────────
    eventCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// name already has unique index from schema field declaration
eventCategorySchema.index({ isActive: 1 });

module.exports = mongoose.model('EventCategory', eventCategorySchema);
