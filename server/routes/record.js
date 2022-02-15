const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');
// Bring in record controller function
const { allRecords, getRecord, addRecord, updateRecord, deleteRecord }= require('../controllers/record');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/images');
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

let upload = multer({ storage, fileFilter });

// This section will help you get a list of all the records.
recordRoutes.route('/record').get(allRecords);

// This section will help you get a single record by id
recordRoutes.route('/record/:id').get(getRecord);

// This section will help you create a new record.
recordRoutes.route('/record/add').post(upload.single('image'), addRecord);

// This section will help you update a record by id.
recordRoutes.route('/update/:id').post(upload.single('image'), updateRecord);

// This section will help you delete a record
recordRoutes.route('/:id').delete(deleteRecord);

module.exports = recordRoutes;
