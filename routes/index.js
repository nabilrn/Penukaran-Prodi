var express = require("express");
var router = express.Router();
const auth = require("../controllers/auth.js");

const verifyToken = require("../middleware/validToken.middleware.js");
const isLogin = require("../middleware/islogin.middleware.js");
const changePassword = require("../controllers/changePassword.js");

router.get("/login", isLogin, auth.form);
router.get("/profile", verifyToken, auth.view_profile);
router.get("/changeProfile", verifyToken, auth.changeProfile);
router.get("/login", isLogin, auth.form);
router.get("/", function (req, res, next) {
  res.render("login", { title: "Home" });
});
router.get("/editpassword", function (req, res, next) {
  res.render("edit_password", { title: "edit password" });
});
router.get("/permohonan", function (req, res, next) {
  res.render("permohonan", { title: "permohonan" });
});
router.get("/history", function (req, res, next) {
  res.render("history", { title: "history" });
});
router.get("/admin/request/pindah_prodi", function (req, res, next) {
  res.render("request", { title: "request-pindah prodi" });
});
router.get("/admin/request/pendaftaran_ulang", function (req, res, next) {
  res.render("req_pu", { title: "request-pendaftaran ulang" });
});
router.get("/admin/arsip", function (req, res, next) {
  res.render("arsip", { title: "Arsip" });
});

router.post("/auth", auth.checklogin);
router.post("/logout", verifyToken, auth.logout);
router.post("/changePassword", verifyToken, async (req, res) => {
  try {
    await changePassword.changePassword(req, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});
router.post("/changeProfile", verifyToken, auth.editProfile);

module.exports = router;
