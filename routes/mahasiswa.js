const express = require("express");
const router = express.Router();
const mahasiswa = require("../controllers/mahasiswa.js");
const verifyToken = require("../middleware/validtoken.middleware"); 
const role = require("../middleware/checkrole.middleware");

router.get("/home", verifyToken, mahasiswa.home);

router.get("/profile", verifyToken, mahasiswa.detail);
router.get("/changeProfile", verifyToken, mahasiswa.changeProfile);

router.get("/permohonan", function (req, res, next) {
  res.render("./mahasiswa/permohonan", { title: "permohonan" });
});
router.post("/permohonan", verifyToken, mahasiswa.submitPermohonanPindah);
router.post("/permohonan/edit", verifyToken, mahasiswa.editPermohonan);

router.get("/notification", verifyToken, mahasiswa.getNotifications);

router.get("/history", verifyToken, mahasiswa.history);

router.post("/deletePermohonan", verifyToken, mahasiswa.deletePermohonan);

router.post("/upload", verifyToken, mahasiswa.uploadProfilePicture);

router.post("/ubahProfile", verifyToken, mahasiswa.editProfile);
router.post("/send-feedback", verifyToken, mahasiswa.sendFeedback);

module.exports = router;
