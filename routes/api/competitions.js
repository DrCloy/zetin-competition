/* Dependencies */
const router = require('express').Router();
const Competition = require('../../models/competition');
const createError = require('http-errors');
const ObjectsToCsv = require('objects-to-csv');
const admin = require('../../middlewares/admin')();
const checkAdmin = require('../../middlewares/admin')({ adminOnly: false });

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
      },
    ).sort({ date: 'desc' });

    res.json(collection);
  } catch (err) {
    next(err);
  }
});

// Response the competition document by id
router.get('/:id', async (req, res, next) => {
  try {
    // for projection query
    const projectionQuery = req.query['projection'];
    let projectionArray = [];
    if (typeof projectionQuery === 'string') {
      projectionArray = projectionQuery.split(',');
    } else if (Array.isArray(projectionQuery)) {
      projectionArray = projectionQuery.slice();
    }

    const projection = {};
    for (const key of projectionArray) {
      projection[key] = 1;
    }

    // find document by id and projection
    let collection = await Competition.find({ _id: req.params.id }, projection);
    if (!collection.length) {
      throw createError(404, '해당 ID를 가진 대회 문서를 찾을 수 없습니다.');
    }

    res.json(collection[0]);
  } catch (err) {
    next(err);
  }
});

// Response the detailed competition document by id
router.get('/detail/:id', admin, async (req, res, next) => {
  try {
    const competition = await Competition.findById(req.params.id).populate({
      path: 'events',
      populate: {
        path: 'participants',
        retainNullValues: true,
      },
    });

    res.send(competition);
  } catch (err) {
    next(err);
  }
});

router.get(`/:id/participants`, checkAdmin, async (req, res, next) => {
  try {
    let { dateSort, toCSV } = req.query;
    const competition = await Competition.findById(req.params.id).populate({
      path: 'events',
      populate: {
        path: 'participants',
        retainNullValue: true,
      },
    });

    if (!competition) {
      throw createError(404, '해당 ID를 가진 대회 문서를 찾을 수 없습니다.');
    }

    // create participant data
    const data = [];
    competition.events.forEach((event) => {
      let realOrder = 0;

      event.participants.forEach((participant) => {
        if (participant)
          data.push({
            ...participant.toObject(),
            competitionName: competition.name,
            eventName: event.name,
            realOrder: ++realOrder,
          });
      });
    });

    // delete the secure fields
    if (!req.isAdmin) {
      data.forEach((value) => {
        delete value.email;
      });
    }

    // sort by datetime
    dateSort = dateSort === 'desc' ? -1 : 1;
    data.sort((a, b) => dateSort * (a.createdAt - b.createdAt));

    // make and send csv file when 'toCSV' query has been provided
    if (toCSV) {
      data.unshift({
        name: '이름',
        email: '이메일',
        team: '소속',
        robotName: '로봇 이름',
        robotCPU: 'CPU',
        robotROM: 'ROM',
        robotRAM: 'RAM',
        robotMotorDriver: '모터 드라이버',
        robotMotor: '모터',
        robotADC: 'ADC',
        robotSensor: '센서',
        competitionName: '대회 이름',
        eventName: '참가 부문',
        entryOrder: '참가 순번',
        realOrder: '실제 순번',
        comment: '하고 싶은 말',
        createdAt: '참가 신청일',
      }); // add custom csv header
      const csv = new ObjectsToCsv(data);
      res.writeHead(200, {
        'Content-Disposition': `attachment; filename="${competition._id.toString()}.csv"`,
        'Content-Type': 'text/csv',
      });
      return res.end(await csv.toString(false));
    }

    res.send(data);
  } catch (err) {
    next(err);
  }
});

// Create new competition document
router.post('/', [
  admin,
  async (req, res, next) => {
    try {
      let document = new Competition(req.body);

      document = await document.save(); // save
      res.json(document);
    } catch (err) {
      next(err);
    }
  },
]);

// Update competition document to request data
router.patch('/:id', [
  admin,
  async (req, res, next) => {
    try {
      let document = await Competition.findById(req.params.id);

      // examine the deleted event has participant(s)
      const originalEvents = document.events.slice();
      const modifiedEventIds = req.body.events.map((e) => e._id.toString());
      for (let event of originalEvents) {
        if (modifiedEventIds.indexOf(event._id.toString()) === -1) {
          // if the event has been removed in the request
          // check the removed event has participant(s)
          if (Array.isArray(event.participants) && event.participants.length) {
            throw createError(
              400,
              `삭제된 '${event.name}' 경연 부문에 참가자가 존재해 삭제할 수 없습니다.`,
            );
          }
        }
      }

      // replace current fields with requested fields
      Object.keys(req.body).forEach((field) => {
        document[field] = req.body[field];
      });

      document = await document.save(); // save
      res.json(document);
    } catch (err) {
      next(err);
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

      res.json(document);
    } catch (err) {
      next(err);
    }
  },
]);

module.exports = router;
