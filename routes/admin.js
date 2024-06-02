var express = require("express");
var router = express.Router();
const auth = require("../controllers/auth.js");
const verifyToken = require("../middleware/validToken.middleware.js"); // Fix the casing of the file name
const role = require("../middleware/checkrole.middleware");

router.get("/dashboard", verifyToken, role("admin"), function (req, res, next) {
  res.render("./admin/admin", { title: "admin" });
});

router.get("/validasi", function (req, res, next) {
  res.render("./admin/validasipp", { title: "validasi permohonan" });
});

router.get("/request", function (req, res, next) {
  res.render("./admin/request", { title: "request" });
});

router.get("/notif", function (req, res, next) {
  res.render("./admin/notif", { title: "Notification" });
});
router.get("/surat", function (req, res, next) {
  res.render("./admin/buatsurat", { title: "Buat Surat" });
});
router.get("/history", function (req, res, next) {
  res.render("./admin/history", { title: "History" });
});


module.exports = router;
