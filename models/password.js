const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const passwordSchema = new mongoose.Schema({
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  digest: { type: String, required: true },
  hash: { type: String, required: true },
  iteration: { type: Number },
  salt: { type: Number },
});

passwordSchema.statics.verify = async function (targetId, plain) {
  const password = await this.findOne({ targetId });

  if (!password) return null;
  if (!plain) return null;

  const match = await bcrypt.compare(plain, password.hash);
  if (match) return password;

  return null;
};

passwordSchema.statics.findByTargetId = async function (targetId) {
  let password = await this.findOne({ targetId });
  if (!password) return null;
  return password;
};

module.exports = mongoose.model('Password', passwordSchema);
