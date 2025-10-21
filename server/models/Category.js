const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      trim: true,
      unique: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
  },
  { timestamps: true }
);

// Create slug from category name before saving
CategorySchema.pre('save', function (next) {
  if (!this.isModified('name')) {
    return next();
  }

  this.slug = this.name
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');

  next();
});

// Virtual populate to get all posts under this category
CategorySchema.virtual('posts', {
  ref: 'Post',              // The model to reference
  localField: '_id',        // Field in this model
  foreignField: 'category', // Field in Post model
  justOne: false,           // It’s a one-to-many relationship
});

module.exports = mongoose.model('Category', CategorySchema);
