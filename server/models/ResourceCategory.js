const mongoose = require('mongoose');

const resourceCategorySchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, 'Category name is required'],
      unique:    true,
      trim:      true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    description: { type: String, default: '', maxlength: [200, 'Description cannot exceed 200 characters'] },
    icon:        { type: String, default: '' },    // emoji or icon class
    color:       { type: String, default: '#6366f1' }, // hex for UI
    slug: {
      type:      String,
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    resourceCount: { type: Number, default: 0 },   // auto-maintained
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ─── Auto-generate slug from name ─────────────────────────────────────────────
resourceCategorySchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
});

module.exports = mongoose.model('ResourceCategory', resourceCategorySchema);
