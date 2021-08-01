/* Dependencies */
const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const createError = require('http-errors');

/* Model */
const File = require('../../models/file');

/* Constants */
const PATH = process.env.PATH_FILES;
const LIMIT_FILESIZE = process.env.LIMIT_FILESIZE || 16 * 1024 * 1024;
const FILE_FIELD_NAME = 'file';

/* Create multer middleware */
const upload = multer({
  storage: multer.diskStorage({
    // NOTE: When passing a string at destination, multer will
    //       make sure that the directory is created for you.
    destination: PATH,
    // NOTE: If no filename is given, each file will be given
    //       a random name that doesn't include any file extension.
    filename: null,
  }),
  limits: {
    fileSize: LIMIT_FILESIZE, // in bytes
  },
}).single(FILE_FIELD_NAME);

/* Middleware for uploading a file */
const uploader = (req, res, next) => {
  const { skipFileUpload } = req.query;

  // if `?skipFileUpload=true', skip file upload
  if (skipFileUpload && skipFileUpload.toLowerCase() === 'true') {
    return next();
  }

  // use multer middleware to upload file.
  upload(req, res, (err) => {
    // REF: https://github.com/expressjs/multer#error-handling
    if (err instanceof multer.MulterError) {
      // a Multer error occurred when uploading(especially about limitation).
      return next(createError(403, err));
    } else if (err) {
      // an unknown error occurred when uploading.
      return next(createError(500, err));
    }

    // if file field is something wrong, `req.file' will be undefined.
    if (!req.file) {
      return next(
        createError(400, `Field of ${FILE_FIELD_NAME} is something wrong`),
      );
    }

    next();
  });
};

// get list of files
router.get('/', async (req, res) => {
  const files = await File.find({});
  res.status(200).json(files);
});

// post a file
router.post('/', uploader, async (req, res, next) => {
  try {
    // multer has saved the file and file information can be accessed by req.file
    // REF: https://github.com/expressjs/multer#file-information
    const { filename, originalname, mimetype, size } = req.file;
    const { category, description } = req.body;

    // create new file document
    const document = new File({
      name: filename,
      category,
      originalName: originalname,
      description,
      mimetype,
      size,
    });

    // save to mongodb
    const file = await document.save();
    res // response to client
      .status(201)
      .header('Location', path.join(req.baseUrl, file.id))
      .json(file);
  } catch (err) {
    next(createError(500, err));
  }
});

// get the file by id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const file = await File.findOne({ _id: id });

    if (!file) {
      return next(createError(404, 'There is no such file document.'));
    }

    const { name, mimetype, originalName, category, description, size } = file;
    const filePath = path.join(PATH, name);

    fs.access(filePath, fs.constants.R_OK, (err) => {
      if (err) {
        return next(createError(404, 'Cannot read such file.'));
      }

      // set header
      res.header('Content-Type', mimetype);
      // send file
      res.sendFile(filePath);
    });
  } catch (err) {
    next(createError(500, err));
  }
});

// delete the file by id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const file = await File.findByIdAndDelete(id);

    if (file) {
      // delete the actual file
      fs.unlink(path.join(PATH, file.name), () => {
        // doesn't matter if the file has already been deleted
        res.status(200).json(file);
      });
    } else {
      res.status(404).send('File document does not exist');
    }
  } catch (err) {
    next(createError(500, err));
  }
});

// patch the file by id
router.patch('/:id', uploader, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, description } = req.body;

    // updated document
    let document = { category, description };
    if (req.file) {
      const { filename, originalname, mimetype, size } = req.file;
      document = {
        ...document,
        name: filename,
        originalName: originalname,
        mimetype,
        size,
      };
    }

    // update the file document
    const oldFile = await File.findByIdAndUpdate(id, document, {
      omitUndefined: true,
    });
    const newFile = await File.findById(id);

    if (oldFile.name !== newFile.name) {
      // delete old file
      fs.unlink(path.join(PATH, oldFile.name), () => {
        // doesn't matter if the file has already been deleted
        res.status(200).json(newFile);
      });
    } else {
      res.status(200).json(newFile);
    }
  } catch (err) {
    next(createError(500, err));
  }
});

module.exports = router;
