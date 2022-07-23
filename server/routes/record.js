const express = require("express");
const multer = require("multer"); //node.js middleware for handling multipart/form-data
const s3Storage = require("multer-sharp-s3");
const { v4: uuidv4 } = require("uuid");
const multerS3 = require("multer-s3"); //streaming multer storage engine for S3
const aws = require("aws-sdk");
let path = require("path");

const S3_KEY_ID = process.env.S3_KEY_ID;
const S3_SECRET = process.env.S3_SECRET;

// Bring in record controller function
const {
  allRecords,
  getRecord,
  addRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/record");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

//fileFilter key is an option to filter acceptable incoming files. Call 'cb' with a boolean to return true or false
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const s3 = new aws.S3({
  secretAccessKey: S3_SECRET,
  accessKeyId: S3_KEY_ID,
  region: "ap-northeast-1",
  Bucket: "veggit-images",
});

//Pass to the multer functon object storage type and fileFilter.
//Inside storage furn multerS3, setting the bucket, metadata, and key (filename)
//Specify that a single file be uploaded, passing the input's "name" attribute
let uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: "veggit-images",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
    },
  }),
  fileFilter,
}).single("image");

//Set up image resizing
const storage2 = s3Storage({
  Key: function (req, file, cb) {
    cb(null, file.originalname);
    console.log(file);
  },
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  s3,
  Bucket: "veggit-images",
  ACL: "public-read",
  resize: {
    width: 400,
  },
  max: true,
});

const upload2 = multer({ storage: storage2 });

// This section will help you get a list of all the records.
recordRoutes.route("/record").get(allRecords);

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(getRecord);

// This section will help you create a new record.
recordRoutes.route("/record/add").post(upload2.single("image"), addRecord);

// This section will help you update a record by id.
recordRoutes.route("/update/:id").put(upload2.single("image"), updateRecord);

// This section will help you delete a record
recordRoutes.route("/:id").delete(deleteRecord);

module.exports = recordRoutes;
