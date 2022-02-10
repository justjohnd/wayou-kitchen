//Basic route to check for user
const express = require("express");
const router = express.Router();
const { getPrivateData } = require("../controllers/private");
const { protect } = require("../middleware/auth");

//This is a protected route, so we run the 'protect' middleware to verify if user has a token. Use "/" since there are not going to be any other routes
router.route("/").get(protect, getPrivateData, function (req, res) {
  let db_connect = dbo.getDb('recipes');
  db_connect
    .collection('records')
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
})


module.exports = router;
