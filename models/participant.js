const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema(
  {
    _competitionId: { type: String, required: true },
    eventId: { type: String, required: true },
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
  },
  { timestamps: true },
);

module.exports = mongoose.model('Participant', participantSchema);
