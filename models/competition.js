const mongoose = require('mongoose');

// Define Schemes
const competitionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    desc: { type: String },
    events: { type: Array },
    date: { type: Date },
    regDateStart: { type: Date },
    regDateEnd: { type: Date },
  },
  { timestamps: true },
);

// Create new todo document
competitionSchema.statics.create = function (payload) {
  // this === Model
  const todo = new this(payload);
  // return Promise
  return todo.save();
};

// Find All
competitionSchema.statics.findAll = function () {
  // return Promise
  return this.find({});
};

// Find One by _id
competitionSchema.statics.findById = function (_id) {
  return this.findOne({ _id });
};

// Update by _id
competitionSchema.statics.updateById = function (_id, payload) {
  // { new: true }: return the modified document rather than the original, defaults to false
  return this.findOneAndUpdate({ _id }, payload, { new: true });
};

// Delete by _id
competitionSchema.statics.deleteById = function (_id) {
  return this.remove({ _id });
};

// Create Model & Export
module.exports = mongoose.model('Competition', competitionSchema);
