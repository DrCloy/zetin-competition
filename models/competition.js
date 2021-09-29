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

competitionSchema.methods.participate = async function (participant) {
  const { _id, eventId, entryOrder } = participant;

  // find event
  let event = null;
  for (let i = 0; i < this.events.length; i++) {
    if (this.events[i]._id.toString() === eventId) {
      event = this.events[i];
      break;
    }
  }

  // Error: Not found
  if (!event) {
    return `해당 경연 부문이 존재하지 않습니다.`;
  }
  // Error: Over the limit
  if (entryOrder >= event.numb) {
    return `정원을 ${event.numb}명을 초과했습니다.`;
  }
  // Error: Already exist
  if (event._participants[entryOrder]) {
    return `해당 순번은 이미 사용중입니다.`;
  }

  // save
  event._participants[entryOrder] = _id;
  this.markModified('events');
  await this.save();

  return 0;
};

// Create Model & Export
module.exports = mongoose.model('Competition', competitionSchema);
