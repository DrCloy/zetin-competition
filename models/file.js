const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    private: Boolean,
    filename: String,
    mimetype: String,
    size: Number, // in bytes
  },
  { timestamps: true },
);

module.exports = mongoose.model('File', fileSchema);
