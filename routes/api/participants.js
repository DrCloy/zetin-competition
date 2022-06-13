/* Dependencies */
const router = require('express').Router();
const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const checkAdmin = require('../../middlewares/admin')({ adminOnly: false });

/* Models */
const Competition = require('../../models/competition');
const Participant = require('../../models/participant');
const Password = require('../../models/password');

const BCRYPT_SALT = 12;

router.use(checkAdmin);

router.get('/', async (req, res, next) => {
  try {
    const { competitionId, dateSort } = req.query;

    const filter = {};
    if (competitionId) {
      filter.competitionId = competitionId;
    }

    const projection = {
      competitionId: 1,
      eventId: 1,
      name: 1,
      team: 1,
      robotName: 1,
      createdAt: 1,
    };

    const options = {
      sort: { createdAt: dateSort || -1 },
    };

    const collection = await Participant.find(filter, projection, options);
    res.json(collection);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // find the document and convert to plain javascript object
    // because only a field of the plain javascript object can be deleted
    let participant = await Participant.findById(id).lean();
    if (!participant) {
      throw createError(404, '해당 참가자를 찾을 수 없습니다.');
    }

    const password = await Password.findByTargetId(id);
    const isAuthed = password.verify(req.headers.authorization);
    if (!isAuthed && !req.isAdmin) {
      // if verification fail, remove sensitive information from response
      delete participant.email;
    }

    res.json(participant);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/password', async (req, res, next) => {
  try {
    // password verification
    const password = await Password.findByTargetId(req.params.id);
    const isAuthed = password.verify(req.headers.authorization);
    if (isAuthed) {
      res.sendStatus(200); // OK
    } else {
      res.sendStatus(401); // Unauthorized
    }
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    // create new document
    const participant = new Participant(req.body);

    // find competition document by id
    const competition = await Competition.findById(
      participant.competitionId.toString(),
    );
    if (!competition) {
      throw createError(404, '참가하는 대회가 존재하지 않습니다.');
    }

    // check existance of password
    const plain = req.body.password;
    if (!plain) {
      throw createError(400, '비밀번호 정보를 찾을 수 없습니다.');
    }

    // create Password document
    const salt = bcrypt.genSaltSync(BCRYPT_SALT);
    const hash = bcrypt.hashSync(plain, salt); // hash password
    const password = new Password({
      targetId: participant._id.toString(),
      digest: 'bcrypt',
      hash,
    });

    // participate
    await competition.participate(participant, {
      ignoreRegistrationPeriod: req.isAdmin,
    });

    await password.save();
    await participant.save();
    res.json(participant);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // find existing document
    const participant = await Participant.findById(id);
    if (!participant) {
      throw createError(404, '해당 참가자를 찾을 수 없습니다.');
    }

    // find competition document
    const competition = await Competition.findById(
      participant.competitionId.toString(),
    );
    if (!competition) {
      throw createError(404, '참가하는 대회가 존재하지 않습니다.');
    }

    // password verification
    const password = await Password.findByTargetId(id);
    const isAuthed = password.verify(req.headers.authorization);
    if (!isAuthed && !req.isAdmin) {
      throw createError(401, '비밀번호 인증에 실패했습니다.');
    }

    // update password
    const newPassword = req.body.password;
    if (newPassword) {
      const salt = bcrypt.genSaltSync(BCRYPT_SALT);
      password.hash = bcrypt.hashSync(newPassword, salt); // hash password
      password.digest = 'bcrypt';
    }

    // replace fields of this document with requested fields
    Object.keys(req.body).forEach((field) => {
      participant[field] = req.body[field];
    });

    // participate
    await competition.participate(participant, {
      ignoreRegistrationPeriod: req.isAdmin,
    });

    await password.save();
    await participant.save();
    res.json(participant);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // find existing document
    let participant = await Participant.findById(id);
    if (!participant) {
      throw createError(404, '해당 참가자를 찾을 수 없습니다.');
    }

    // password verification
    const password = await Password.findByTargetId(id);
    const isAuthed = password.verify(req.headers.authorization);
    if (!isAuthed && !req.isAdmin) {
      throw createError(401, '비밀번호 인증에 실패했습니다.');
    }

    // unparticipate
    const competition = await Competition.findById(
      participant.competitionId.toString(),
    );
    competition &&
      (await competition.unparticipate(participant, {
        ignoreRegistrationPeriod: req.isAdmin,
      }));

    // deletion
    await Password.findByIdAndDelete(password._id.toString());
    await Participant.findByIdAndDelete(id);
    res.json(participant);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
