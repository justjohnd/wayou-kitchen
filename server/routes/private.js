//Basic route to check for user
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

// This will help us connect to the database
const dbo = require('../db/conn');

router.route("/").get(protect, async function (req, res, next) {
  let db_connect = dbo.getDb();
  let myQuery = { userId: `${req.user._id}` };

  const returnedDocument = await db_connect.collection('records').find(myQuery).toArray();

  res.status(200).json({
    records: returnedDocument,
    success: true,
    data: 'Yo yo you yo backend yo',
    id: req.user._id,
  });
});

module.exports = router;

  
// userId: req.user._id
