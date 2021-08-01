const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: String,
    originalName: String,
    description: String,
    mimetype: String,
    size: Number, // in bytes
  },
  { timestamps: true },
);

module.exports = mongoose.model('File', fileSchema);
