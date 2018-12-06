const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

let fileName = "";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/unchecked/');
  },
  filename: (req, file, cb) => {
    fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});

const upload = multer({
  storage,
  limits: {fileSize: 2 * 1024 * 1024},
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      const err = new Error('Extension');
      err.code = 'EXTENSION';
      return cb(err);
    }
    cb(null, true);
  }
}).single('add-recipe__photo');

router.post('/image', (req, res) => {
  upload(req, res, err => {
    let error = '';
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        error = 'Image must be 2MB or less!';
      }
      if (err.code === 'EXTENSION') {
        error = 'Only jpg, jpeg and png!';
      }
    }
    console.log(fileName);
    res.json({
      ok: fileName
    });
  });
});

module.exports = router;
