const router = require('express').Router();
const Rule = require('../../models/rule');

// Find all
router.get('/', (req, res) => {
  Rule.findAll()
    .sort({ name: 'asc', version: 'desc' })
    .then((rules) => {
      res.json(rules);
    })
    .catch((err) => res.status(500).send(err));
});

// Find one by _id
router.get('/:id', (req, res) => {
  Rule.findById(req.params.id)
    .then((rule) => res.json(rule))
    .catch((err) => res.status(500).send(err));
});

// Create new competition document
router.post('/', (req, res) => {
  Rule.create(req.body)
    .then((rule) => res.status(200).json(rule))
    .catch((err) => res.status(500).send(err));
});

// Update by _id
router.patch('/:id', (req, res) => {
  Rule.updateById(req.params.id, req.body)
    .then((rule) => res.status(200).json(rule))
    .catch((err) => res.status(500).send(err));
});

// Delete by _id
router.delete('/:id', (req, res) => {
  Rule.deleteById(req.params.id)
    .then((rule) => res.status(200).json(rule))
    .catch((err) => res.status(500).send(err));
});

module.exports = router;
