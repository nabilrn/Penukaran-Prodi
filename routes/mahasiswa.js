var express = require("express");
var router = express.Router();
const auth = require("../controllers/auth.js");
const verifyToken = require("../middleware/validToken.middleware.js");
const role = require("../middleware/checkrole.middleware");

router.get("/home", verifyToken, role("mahasiswa"), function (req, res, next) {
  res.render("./mahasiswa/home", { title: "Home" });
});
router.get("/profile", verifyToken, auth.view_profile);
router.get("/changeProfile", verifyToken, auth.changeProfile);

router.post("/changeProfile", verifyToken, auth.editProfile);


router.get("/permohonan", function (req, res, next) {
  res.render("./mahasiswa/permohonan", { title: "permohonan" });
});

router.get("/history", function (req, res, next) {
  res.render("./mahasiswa/history", { title: "history" });
});
module.exports = router;
