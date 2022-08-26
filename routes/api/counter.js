const router = require('express').Router();

let queue = []; // {value: "값"}
let resQueue = []; // response queue

router.get('/', async (req, res, next) => {
  try {
    if (queue.length) {
      res.send(queue.shift().command);
    } else {
      resQueue.push(res);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/lookup', async (req, res, next) => {
  try {
    res.send(queue);
  } catch (err) {
    next(err);
  }
});

router.delete('/clear', async (req, res, next) => {
  try {
    queue = [];
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    queue.push(req.body);
    if (resQueue.length) {
      const res = resQueue.shift();
      res.send(queue.shift().command);
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
