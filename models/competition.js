const mongoose = require('mongoose');
const Participant = require('./participant');

// Define Schemes
const competitionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    desc: { type: String },
    events: [
      {
        _id: { type: mongoose.Schema.ObjectId, auto: true },
        participants: [{ type: String }],
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

// Method: Find event by id
competitionSchema.methods.findEventById = function (eventId) {
  let ret = null;

  for (let i = 0; i < this.events.length; i++) {
    let event = this.events[i];

    if (event._id.toString() === eventId) {
      ret = event;
      break;
    }
  }

  return ret;
};

// Method: Remove the exsiting order
competitionSchema.methods.removeExistingOrderById = function (id) {
  this.events.forEach((event) => {
    const { participants } = event;

    for (let i = 0; i < participants.length; i++) {
      if (participants[i] === id) {
        participants[i] = null;
      }
    }
  });
};

competitionSchema.methods.participate = async function (participant) {
  if (!(participant instanceof Participant)) {
    throw new Error('The argument is not Participant model');
  }

  const { _id, _eventId, entryOrder } = participant;
  const id = _id.toString();

  // find the event
  let event = this.findEventById(_eventId);
  const { participants, numb } = event;

  // Error: Not Found (eventId is not valid)
  if (!event) {
    return `해당 경연 부문이 존재하지 않습니다.`;
  }
  // Error: Over the limit
  if (entryOrder >= numb) {
    return `정원 ${numb}명을 초과했습니다`;
  }
  // Error: Already exist
  if (participants[entryOrder] && participants[entryOrder] !== id) {
    return `이미 해당 순번 ${entryOrder}이(가) 점유됐습니다.`;
  }

  // remove the existing order
  this.removeExistingOrderById(id);

  // participate
  event.participants[entryOrder] = id;
  this.markModified('events');
  await this.save();

  return 0;
};

competitionSchema.methods.unparticipate = async function (participant) {
  if (!(participant instanceof Participant)) {
    throw new Error('The argument is not Participant model');
  }

  this.removeExistingOrderById(participant._id.toString());
  this.markModified('events');
  await this.save();

  return 0;
};

// Create Model & Export
module.exports = mongoose.model('Competition', competitionSchema);
