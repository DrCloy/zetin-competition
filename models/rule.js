const mongoose = require('mongoose');

// Define Schemes
const ruleSchema = new mongoose.Schema({
  name: { type: String, require: true },
  version: { type: String, require: true },
  content: { type: String, require: true },
});

// Create new rule document
ruleSchema.statics.create = function (payload) {
  // this === Model
  const rule = new this(payload);
  // return Promise
  return rule.save();
};

// Find All
ruleSchema.statics.findAll = function () {
  // return Promise
  return this.find({});
};

// Find One by _id
ruleSchema.statics.findById = function (_id) {
  return this.findOne({ _id });
};

// Update by _id
ruleSchema.statics.updateById = function (_id, payload) {
  // { new: true }: return the modified document rather than the original, defaults to false
  return this.findOneAndUpdate({ _id }, payload, { new: true });
};

// Delete by _id
ruleSchema.statics.deleteById = function (_id) {
  return this.deleteOne({ _id });
};

// Create Model & Export
module.exports = mongoose.model('Rule', ruleSchema);
