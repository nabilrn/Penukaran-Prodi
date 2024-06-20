var express = require("express");
var router = express.Router();
const admin = require("../controllers/admin.js");
const verifyToken = require("../middleware/validtoken.middleware.js");
const role = require("../middleware/checkrole.middleware");

router.get("/dashboard", verifyToken, role("admin"), function (req, res, next) {
  res.render("./admin/admin", { title: "admin" });
});

router.get("/validasi", function (req, res, next) {
  res.render("./admin/validasipp", { title: "validasi permohonan" });
});

router.get("/request", verifyToken, admin.listPermohonan);
// Define route
router.get("/notif", function (req, res, next) {
  res.render("./admin/notif", { title: "Notification" });
});
router.get("/request/:id", verifyToken, admin.getPermohonanDetail);
router.get("/surat", function (req, res, next) {
  res.render("./admin/buatsurat", { title: "Buat Surat" });
});
router.get("/history", function (req, res, next) {
  res.render("./admin/history", { title: "History" });
});
router.get("/buatsurat", function (req, res, next) {
  res.render("./admin/buatsurat", { title: "buatsurat" });
});

router.post("/reject", verifyToken, admin.rejectPermohonan);
router.post("/accept", verifyToken, admin.acceptPermohonan);

module.exports = router;
