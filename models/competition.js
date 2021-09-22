const mongoose = require('mongoose');

// Define Schemes
const competitionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    desc: { type: String },
    events: [
      {
        _id: { type: mongoose.Schema.ObjectId, auto: true },
        _participants: [{ type: String }],
        name: { type: String, required: true, unique: true },
        desc: { type: String },
        numb: { type: Number },
      },
    ],
    date: { type: Date },
    regDateStart: { type: Date },
    regDateEnd: { type: Date },
    place: { type: String },
    googleMap: { type: String },
    organizer: { type: String },
    sponser: { type: String },
    prize: { type: String },
    rule: { type: String },
    moreInfo: { type: String },
    posterId: { type: String },
  },
  { timestamps: true },
);

// Create Model & Export
module.exports = mongoose.model('Competition', competitionSchema);
