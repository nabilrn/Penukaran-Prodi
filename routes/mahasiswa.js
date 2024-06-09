var express = require("express");
var router = express.Router();
const mahasiswa = require("../controllers/mahasiswa.js");
const verifyToken = require("../middleware/validToken.middleware.js");
const role = require("../middleware/checkrole.middleware");

router.get("/home", verifyToken, role("mahasiswa"), function (req, res, next) {
  res.render("./mahasiswa/home", { title: "Home" });
});
router.get("/profile", verifyToken, mahasiswa.detail);
router.get("/changeProfile", verifyToken, mahasiswa.changeProfile);

router.get("/permohonan", function (req, res, next) {
  res.render("./mahasiswa/permohonan", { title: "permohonan" });
});


router.get("/history", function (req, res, next) {
  res.render("./mahasiswa/history", { title: "history" });
});
router.get("/notification", function (req, res, next) {
  res.render("./mahasiswa/notification", { title: "notification" });
});

router.post('/upload', verifyToken,  mahasiswa.uploadProfilePicture);

router.post("/ubahProfile", verifyToken, mahasiswa.editProfile);
router.post('/permohonan', verifyToken, mahasiswa.submitPermohonanPindah);

module.exports = router;
