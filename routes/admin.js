var express = require("express");
var router = express.Router();
const admin = require("../controllers/admin.js");
const verifyToken = require("../middleware/validtoken.middleware.js");
const role = require("../middleware/checkrole.middleware");

router.get("/dashboard", verifyToken, role("admin"), admin.getDashboardData);
router.get("/validasi", function (req, res, next) {
  res.render("./admin/validasipp", { title: "validasi permohonan" });
});
router.get("/request", verifyToken, admin.listPermohonan);
router.get("/feeback", verifyToken, admin.getAllFeedback);
router.get("/notif", verifyToken, admin.getNotif);
router.get("/request/:id", verifyToken, admin.getPermohonanDetail);


router.get("/buatsurat/:id", verifyToken, admin.dataSurat);
router.get("/surat", function (req, res, next) {
  res.render("./admin/buatsurat", { title: "Buat Surat" });
});
router.get("/history", verifyToken, admin.getAllPermohonanBp);
router.post("/reject", verifyToken, admin.rejectPermohonan);
router.post("/accept", verifyToken, admin.acceptPermohonan);
router.post("/updateNim", verifyToken, admin.updateUsername);
router.post("/generateSurat/:id", verifyToken, admin.generatePdf);

module.exports = router;
