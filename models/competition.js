const mongoose = require('mongoose');
const Participant = require('./participant');
const createError = require('http-errors');

// Define Schemes
const competitionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    desc: { type: String },
    events: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        participants: [
          { type: mongoose.Schema.Types.ObjectId, ref: 'Participant' },
        ],
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

// Method: Remove the exsiting order
competitionSchema.methods.removeExistingOrderById = function (id) {
  this.events.forEach((event) => {
    const { participants } = event;

    for (let i = 0; i < participants.length; i++) {
      const pid = participants[i];
      if (!pid) continue;
      if (pid.toString() === id) {
        participants[i] = null;
      }
    }
  });
};

competitionSchema.methods.isRegistrationPeriod = function () {
  const start = this.regDateStart.getTime();
  const end = this.regDateEnd.getTime();
  const now = Date.now();

  return start <= now && now <= end;
};

// Method: Participate the given participant to the competition
competitionSchema.methods.participate = async function (
  participant,
  options = {},
) {
  const { ignoreRegistrationPeriod } = options;

  if (!(participant instanceof Participant)) {
    throw createError(500, 'The argument is not Participant model');
  }
  const { _id, eventId, entryOrder } = participant;
  const id = _id.toString();

  if (!this.isRegistrationPeriod() && !ignoreRegistrationPeriod) {
    throw createError(400, '참가 신청 기간이 아닙니다.');
  }

  const event = this.events.find(
    (evt) => evt._id.toString() === eventId.toString(),
  );
  if (!event) {
    throw createError(404, '참가자가 선택한 경연 부문이 존재하지 않습니다.');
  }
  const { participants, numb } = event;

  if (entryOrder > numb) {
    // 인덱스가 1부터 시작하기 때문에, 참가 순번과 정원이 일치해도 상관없다.
    throw createError(400, `정원 ${numb}명을 초과했습니다`);
  }

  const participantId = participants[entryOrder];
  if (participantId && participantId.toString() !== id) {
    throw createError(409, `이미 해당 순번 ${entryOrder}이(가) 점유됐습니다.`);
  }

  this.removeExistingOrderById(id); // 1. 참가자의 기존 순번 삭제
  event.participants[entryOrder] = id; // 2. 참가자가 선택한 순번 기록
  this.markModified('events'); // 3. events 필드가 수정됐음을 mongoose에 알림
  await this.save(); // 4. 저장
};

// Method: Unparticipate the given participant from the competition
competitionSchema.methods.unparticipate = async function (
  participant,
  options,
) {
  const { ignoreRegistrationPeriod } = options;

  if (!(participant instanceof Participant)) {
    throw createError(500, 'The argument is not Participant model');
  }

  if (!this.isRegistrationPeriod() && !ignoreRegistrationPeriod) {
    throw createError(400, '참가 신청 기간이 아닙니다.');
  }

  this.removeExistingOrderById(participant._id.toString()); // 1. 참가자의 기존 순번 삭제
  this.markModified('events'); // 2. events 필드가 수정됐음을 mongoose에 알림
  await this.save(); // 3. 저장
};

// Create Model & Export
module.exports = mongoose.model('Competition', competitionSchema);
