/* Dependencies */
const router = require('express').Router();
const Competition = require('../../models/competition');
const createError = require('http-errors');
const admin = require('../../middlewares/admin')();

// Response competition collection
// (with createdAt, updatedAt, date, regDateEnd, regDateStart, name, posterId)
router.get('/', async (req, res, next) => {
  try {
    let collection = await Competition.find(
      {},
      {
        name: 1,
        date: 1,
        regDateStart: 1,
        regDateEnd: 1,
        posterId: 1,
        createAt: 1,
        updatedAt: 1,
      },
    ).sort({ date: 'desc' });

    res.status(200).json(collection);
  } catch (err) {
    next(createError(500, err));
  }
});

// Response the competition document by id
router.get('/:id', async (req, res, next) => {
  try {
    let document = await Competition.findById(req.params.id);

    if (document) {
      res.status(200).json(document);
    } else {
      return next(
        createError(404, 'Competition document does not exist for that id.'),
      );
    }
  } catch (err) {
    next(createError(500, err));
  }
});

// Create new competition document
router.post('/', [
  admin,
  async (req, res, next) => {
    try {
      let document = new Competition(req.body);

      document = await document.save(); // save
      res.status(200).json(document);
    } catch (err) {
      next(createError(500, err));
    }
  },
]);

// Update competition document to request data
router.patch('/:id', [
  admin,
  async (req, res, next) => {
    try {
      let document = await Competition.findById(req.params.id);

      // replace current fields with requested fields
      Object.keys(req.body).forEach((field) => {
        document[field] = req.body[field];
      });

      document = await document.save(); // save
      res.status(200).json(document);
    } catch (err) {
      next(createError(500, err));
    }
  },
]);

// Delete competition document by id
router.delete('/:id', [
  admin,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      let document = await Competition.findByIdAndDelete(id);

      res.status(200).json(document);
    } catch (err) {
      next(createError(500, err));
    }
  },
]);

module.exports = router;
