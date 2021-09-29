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

router.post('/:competitionId', async (req, res, next) => {
  try {
    const { competitionId } = req.params;

    // create new document
    let participant = new Participant(req.body);
    participant._competitionId = competitionId;

    // find competition document by id
    let competition = await Competition.findById(competitionId);
    if (!competition) {
      return next(
        createError(
          404,
          `There isn't a competition document about ${competitionId}.`,
        ),
      );
    }

    // participate
    let retParticipate = await competition.participate(participant);
    if (retParticipate) {
      return next(createError(403, retParticipate));
    }

    await participant.save();
    res.send(participant);
  } catch (err) {
    next(createError(500, err));
  }
});

module.exports = router;
