/* Dependencies */
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const router = require('express').Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

/* Constants */
const PATH = path.join(process.env.PATH_FILES, 'posters');

// get poster iamge path by id regardless of file extension
function getPosterPath(id) {
  return new Promise((resolve, reject) => {
    fs.readdir(PATH, (err, files) => {
      if (err) reject(err);

      let regex = new RegExp(`^(${id})\\.(?:jpg|jpeg|png)`, 'gi');
      let candidates = files.filter((file) => file.match(regex));

      if (candidates.length == 0) {
        reject(new Error(`Poster path of ${id} is not found`));
      } else {
        resolve(path.join(PATH, candidates[0]));
      }
    });
  });
}

// get poster list
router.get('/', (req, res) => {
  fs.readdir(PATH, (err, files) => {
    if (err) res.sendStatus(500);
    else res.status(200).send(files);
  });
});

// get poster image
router.get('/:id', (req, res) => {
  getPosterPath(req.params.id)
    .then((path) => res.sendFile(path))
    .catch((err) => res.status(404).send(err.toString()));
});

// post poster image
router.post('/:id', upload.single('poster'), (req, res) => {
  const { buffer, mimetype } = req.file;
  const extension = mime.extension(mimetype);

  fs.writeFile(
    path.join(PATH, `${req.params.id}.${extension}`),
    buffer,
    (err) => {
      if (err) res.sendStatus(500);
      else
        res
          .status(201)
          .header('Location', req.baseUrl + req.path)
          .send();
    },
  );
});

// delete poster image
router.delete('/:id', (req, res) => {
  getPosterPath(req.params.id)
    .then((path) => {
      fs.unlink(path, function (err) {
        if (err) res.sendStatus(500);
        else res.status(200).send('The poster has been deleted');
      });
    })
    .catch((err) => {
      res.status(200).send('The poster is not found');
    });
});

module.exports = (function () {
  // make directory if it doesn't exist.
  fs.mkdir(PATH, { recursive: true }, (err) => {
    if (err) throw err;
  });

  return router;
})();
