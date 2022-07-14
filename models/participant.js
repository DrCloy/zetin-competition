const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema(
  {
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Competition',
    },
    eventId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    team: String,
    robotName: { type: String, required: true },
    robotCPU: String,
    robotROM: String,
    robotRAM: String,
    robotMotorDriver: String,
    robotMotor: String,
    robotADC: String,
    robotSensor: String,
    entryOrder: { type: Number, required: true },
    comment: String,
    privacyAgreed: Boolean,
  },
  { timestamps: true },
);

module.exports = mongoose.model('Participant', participantSchema);
