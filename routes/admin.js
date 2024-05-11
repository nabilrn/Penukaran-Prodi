var express = require("express");
var router = express.Router();
const auth = require("../controllers/auth.js");
const verifyToken = require("../middleware/validToken.middleware.js");
const role = require("../middleware/checkrole.middleware");

router.get("/dashboard", verifyToken, role("admin"), function (req, res, next) {
    res.render("admin", { title: "admin" });
  });


module.exports = router