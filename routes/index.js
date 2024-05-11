var express = require("express");
var router = express.Router();
const auth = require("../controllers/auth.js");
const verifyToken = require("../middleware/validToken.middleware.js");
const isLogin = require("../middleware/islogin.middleware.js")
// /* GET Login . */
// router.get("/login", function (req, res, next) {
//   res.render("login", { title: "login" });
// });


router.get('/login', isLogin, auth.form);
router.post('/auth', auth.checklogin);
router.post('/logout', verifyToken,auth.logout);



// router.get("/home", verifyToken, role("mahasiswa"), function (req, res, next) {
//   res.render("home", { title: "Home" });
// });

router.get("/", function (req, res, next) {
  res.render("login", { title: "Home" });
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
// router.get("/admin", function (req, res, next) {
//   res.render("admin", { title: "admin" });
// });

module.exports = router;