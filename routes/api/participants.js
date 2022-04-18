/* Dependencies */
const router = require('express').Router();
const createError = require('http-errors');
const bcrypt = require('bcrypt');

/* Models */
const Competition = require('../../models/competition');
const Participant = require('../../models/participant');
const Password = require('../../models/password');

const BCRYPT_SALT = 12;

router.get('/', async (req, res, next) => {
  try {
    const { competitionId, dateSort } = req.query;

    const filter = {};
    if (competitionId) {
      filter._competitionId = competitionId;
    }

    const projection = {
      _competitionId: 1,
      _eventId: 1,
      name: 1,
      team: 1,
      robotName: 1,
      createdAt: 1,
    };

    const options = {
      sort: { createdAt: dateSort || -1 },
    };

    let collection = await Participant.find(filter, projection, options);
    res.json(collection);
  } catch (err) {
    next(createError(500, err));
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let participant = await Participant.findById(id);

    if (participant) {
      // password verification
      const password = await Password.verify(id, req.headers['authorization']);
      if (!password) {
        // verification fail, remove sensitive information from response
        participant['email'] = null;
      }
      res.json(participant);
    } else {
      return next(createError(404, 'Participant not found'));
    }
  } catch (err) {
    next(createError(500, err));
  }
});

router.post('/', async (req, res, next) => {
  try {
    // check existance of password
    const plain = req.body.password;
    if (!plain) {
      return next(createError(400, 'Password information not found'));
    }

    // create new document
    let participant = new Participant(req.body);

    // find competition document by id
    let competition = await Competition.findById(participant._competitionId);
    if (!competition) {
      return next(createError(404, 'Competition document not found'));
    }

    // participate
    let retParticipate = await competition.participate(participant);
    if (retParticipate) {
      return next(createError(412, retParticipate));
    }

    await participant.save();

    // create Password document
    const hash = await bcrypt.hash(plain, BCRYPT_SALT); // hash password

    let password = new Password({
      targetId: participant._id,
      digest: 'bcrypt',
      hash,
    });

    await password.save();

    res.send(participant);
  } catch (err) {
    next(createError(500, err));
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // find existing document
    let participant = await Participant.findById(id);
    if (!participant) {
      next(createError(404, 'Participant document not found'));
    }

    // password verification
    const password = await Password.verify(id, req.headers['authorization']);
    if (!password) {
      return next(createError(401, 'Authentication failed')); // verification fail
    }

    // replace current fields with requested fields
    Object.keys(req.body).forEach((field) => {
      participant[field] = req.body[field];
    });

    // find competition document
    let competition = await Competition.findById(participant._competitionId);
    if (!competition) {
      next(createError(404, 'Competition document not found'));
    }

    // participate
    let retParticipate = await competition.participate(participant);
    if (retParticipate) {
      return next(createError(412, retParticipate));
    }

    await participant.save();
    res.send(participant);
  } catch (err) {
    next(createError(500, err));
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    let participant = await Participant.findById(id);
    if (!participant) {
      return next(createError(404, 'Participant document not found'));
    }

    // password verification
    const password = await Password.verify(id, req.headers['authorization']);
    if (password) {
      await Password.findByIdAndDelete(password._id); // password deletion
    } else {
      return next(createError(401, 'Authentication failed')); // verification fail
    }

    // document deletion
    participant = await Participant.findByIdAndDelete(id);
    if (participant) {
      let competition = await Competition.findById(participant._competitionId);
      if (competition) {
        competition.unparticipate(participant);
      }
    }

    res.status(200).json(participant);
  } catch (err) {
    next(createError(500, err));
  }
});

module.exports = router;
