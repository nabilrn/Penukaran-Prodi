var express = require("express");
var router = express.Router();
const auth = require("../controllers/auth.js");
const verifyToken = require("../middleware/validToken.middleware.js");
const role = require("../middleware/checkrole.middleware");

router.get("/home", verifyToken, role("mahasiswa"), function (req, res, next) {
  res.render("home", { title: "Home" });
});

module.exports = router;
