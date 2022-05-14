/* Dependencies */
const router = require('express').Router();
const multer = require('multer');
const sharp = require('sharp');
const mime = require('mime-types');
const path = require('path');
const fs = require('fs');
const createError = require('http-errors');

/* Models */
const File = require('../../models/file');

/* Constants */
const PATH = process.env.PATH_FILES;
const FILE_FIELD_NAME = 'file';
const THUMB_PATH = path.join(PATH, 'thumbnails');
const THUMB_EXTENSION = 'jpg';
const THUMB_WIDTH = 720;

/* Middlewares */
const admin = require('../../middlewares/admin')();
const adminCheck = require('../../middlewares/admin')({ adminOnly: false });
const upload = (req, res, next) =>
  multer({
    storage: multer.diskStorage({
      // NOTE: When passing a string at destination, multer will
      //       make sure that the directory is created for you.
      destination: PATH,
      // NOTE: If no filename is given, each file will be given
      //       a random name that doesn't include any file extension.
      filename: null,
    }),
  }).single(FILE_FIELD_NAME)(req, res, (err) => {
    // REF: https://github.com/expressjs/multer#error-handling
    if (err instanceof multer.MulterError) {
      // a Multer error occurred when uploading(especially about limitation).
      return next(createError(403, err));
    } else if (err) {
      // an unknown error occurred when uploading.
      return next(createError(500, err));
    }

    next();
  });

/* Thumbnail generator */
const generateThumbnail = (imageFilePath) => {
  return new Promise((resolve, reject) => {
    // check the thumbnail folder exists
    if (!fs.existsSync(THUMB_PATH)) {
      fs.mkdirSync(THUMB_PATH, { recursive: true });
    }
    const thumbnailPath = path.join(THUMB_PATH, path.basename(imageFilePath));

    // check that the thumbnail file exists and it is the latest file.
    if (
      fs.existsSync(thumbnailPath) &&
      fs.statSync(imageFilePath).mtimeMs < fs.statSync(thumbnailPath).mtimeMs
    ) {
      resolve(thumbnailPath);
    } else {
      // resize and convert image
      sharp(imageFilePath)
        .resize({ width: THUMB_WIDTH })
        .toFormat(THUMB_EXTENSION)
        .toFile(thumbnailPath, function (err) {
          if (err) reject(err);
          resolve(thumbnailPath);
        });
    }
  });
};

router.get('/', admin, async (req, res) => {
  const files = await File.find({});
  res.json(files);
});

router.post('/', admin, upload, async (req, res, next) => {
  try {
    // multer has saved the file and file information can be accessed by req.file
    // REF: https://github.com/expressjs/multer#file-information
    if (!req.file) {
      throw createError(
        400,
        `${FILE_FIELD_NAME} 필드에 파일이 없거나 잘못되었습니다.`,
      );
    }
    const { filename, originalname, mimetype, size } = req.file;

    // create new file document
    const { name, description, private } = req.body;
    const document = new File({
      name: name || originalname,
      description,
      filename,
      mimetype,
      size,
      private,
    });

    // save to mongodb
    const file = await document.save();
    res // response to client
      .status(201)
      .header('Location', path.join(req.baseUrl, file.id))
      .json(file);
  } catch (err) {
    if (req.file) {
      // clean the uploaded file
      fs.unlinkSync(path.join(PATH, req.file.filename));
    }
    next(err);
  }
});

router.get('/:id', adminCheck, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { thumbnail } = req.query;
    const file = await File.findById(id);

    if (!file) {
      throw createError(404, '해당 파일을 찾을 수 없습니다.');
    }
    const { filename, mimetype, private } = file;
    let contentType = mimetype;

    if (private && !req.isAdmin) {
      throw createError(401, '비밀 문서입니다. 관리자 인증 정보가 필요합니다.');
    }

    let filePath = path.join(PATH, filename);
    if (!fs.existsSync(filePath)) {
      throw createError(500, '실제 파일이 존재하지 않습니다.');
    }

    // get thumbnail image
    if (thumbnail && thumbnail.toLowerCase() === 'true') {
      if (mimetype.match(/^(image\/)/gi)) {
        filePath = await generateThumbnail(filePath);
        contentType = mime.lookup(THUMB_EXTENSION);
      } else {
        throw createError(
          403,
          `${mimetype} 타입의 미리보기 이미지를 가져올 수 없습니다.`,
        );
      }
    }

    res.header('Content-Type', contentType).sendFile(filePath);
  } catch (err) {
    next(err);
  }
});

router.get('/detail/:id', adminCheck, async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file) {
      throw createError(404, '해당 파일을 찾을 수 없습니다.');
    }

    if (file.private && !req.isAdmin) {
      throw createError(401, '비밀 문서입니다. 관리자 인증 정보가 필요합니다.');
    }

    res.json(file);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', admin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await File.findByIdAndDelete(id);
    if (!file) {
      throw createError(404, '해당 파일을 찾을 수 없습니다.');
    }

    // delete the actual file
    fs.unlinkSync(path.join(PATH, file.filename));

    res.json(file);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', admin, upload, async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file) {
      throw createError(404, '해당 파일을 찾을 수 없습니다.');
    }

    // replace fields of this document with requested fields
    for (const field in req.body) {
      file[field] = req.body[field];
    }

    // when the file is uploaded, delete the old file and update file information
    if (req.file) {
      fs.unlinkSync(path.join(PATH, file.filename)); // delete the old file

      const { filename, mimetype, size } = req.file;
      file.filename = filename;
      file.mimetype = mimetype;
      file.size = size;
    }

    await file.save();
    res.json(file);
  } catch (err) {
    if (req.file) {
      // clean the uploaded file
      fs.unlinkSync(path.join(PATH, req.file.filename));
    }
    next(err);
  }
});

module.exports = router;
