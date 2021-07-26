const router = require('express').Router();
const Competition = require('../../models/competition');

// Find all
router.get('/', (req, res) => {
  Competition.findAll()
    .sort({ date: 'desc' })
    .then((comps) => {
      res.json(comps);
    })
    .catch((err) => res.status(500).send(err));
});

// Find one by _id
router.get('/:id', (req, res) => {
  Competition.findById(req.params.id)
    .then((comp) => {
      if (comp) res.json(comp);
      else
        res
          .status(404)
          .send('Competition information does not exist for that id.');
    })
    .catch((err) => res.status(500).send(err));
});

// Create new competition document
router.post('/', (req, res) => {
  Competition.create(req.body)
    .then((comp) => res.status(200).json(comp))
    .catch((err) => res.status(500).send(err));
});

// Update by _id
router.patch('/:id', (req, res) => {
  Competition.updateById(req.params.id, req.body)
    .then((comp) => res.status(200).json(comp))
    .catch((err) => res.status(500).send(err));
});

// Delete by _id
router.delete('/:id', (req, res) => {
  Competition.deleteById(req.params.id)
    .then((comp) => res.status(200).json(comp))
    .catch((err) => res.status(500).send(err));
});

module.exports = router;
