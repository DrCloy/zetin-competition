/* Dependencies */
const router = require('express').Router();
const createError = require('http-errors');

/* Models */
const Competition = require('../../models/competition');
const Participant = require('../../models/participant');

router.get('/', async (req, res, next) => {
  try {
    let collection = await Participant.find({});
    res.json(collection);
  } catch (err) {
    next(createError(500, err));
  }
});

router.post('/', async (req, res, next) => {
  try {
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

    let participant = await Participant.findByIdAndDelete(id);
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
