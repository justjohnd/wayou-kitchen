const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
let path = require('path');

const S3_KEY_ID = process.env.S3_KEY_ID;
const S3_SECRET = process.env.S3_SECRET;

// Bring in record controller function
const { allRecords, getRecord, addRecord, updateRecord, deleteRecord }= require('../controllers/record');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './client/public/images');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const s3 = new aws.S3({
  secretAccessKey: S3_SECRET,
  accessKeyId: S3_KEY_ID,
  region: 'ap-northeast-1',
  Bucket: 'veggit-images',
});

let upload = multer({ storage, fileFilter });

let uploadS3 = 
  multer({
  storage: multerS3({
    s3: s3,
    bucket: 'veggit-images',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      console.log(file);
      cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
   }),
}).single('image');

// This section will help you get a list of all the records.
recordRoutes.route('/record').get(allRecords);

// This section will help you get a single record by id
recordRoutes.route('/record/:id').get(getRecord);

// This section will help you create a new record.
recordRoutes.route('/record/add').post(uploadS3, addRecord);

// This section will help you update a record by id.
recordRoutes.route('/update/:id').post(uploadS3, updateRecord);

// This section will help you delete a record
recordRoutes.route('/:id').delete(deleteRecord);

module.exports = recordRoutes;
