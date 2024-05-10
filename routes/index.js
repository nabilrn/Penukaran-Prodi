var express = require("express");
var router = express.Router();

/* GET Login . */
router.get("/", function (req, res, next) {
  res.render("index", { title: "login" });
});
router.get("/home", function (req, res, next) {
  res.render("home", { title: "Home" });
});
router.get("/account", function (req, res, next) {
  res.render("account", { title: "account" });
});
router.get("/editprofile", function (req, res, next) {
  res.render("edit_profile", { title: "edit profile" });
});
router.get("/editpassword", function (req, res, next) {
  res.render("edit_password", { title: "edit password" });
});
router.get("/admin", function (req, res, next) {
  res.render("admin", { title: "admin" });
});

module.exports = router;
