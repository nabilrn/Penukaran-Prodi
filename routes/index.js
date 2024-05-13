var express = require("express");
var router = express.Router();
const auth = require("../controllers/auth.js");

const verifyToken = require("../middleware/validToken.middleware.js");

const isLogin = require("../middleware/islogin.middleware.js");
const changePassword = require("../controllers/changePassword.js");
// /* GET Login . */
// router.get("/login", function (req, res, next) {
//   res.render("login", { title: "login" });
// });

router.get("/login", isLogin, auth.form);
router.get("/profile", verifyToken, auth.view_profile);

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


router.get("/changeProfile", verifyToken, auth.changeProfile);

router.get('/login', isLogin, auth.form);
router.post('/auth', auth.checklogin);
router.post('/logout', verifyToken,auth.logout);
router.post("/changePassword", verifyToken, async (req, res) => {
  try {
    await changePassword.changePassword(req, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});



// router.post("/changeProfile", verifyToken, async (req, res) => {
//   try {
//     await editProfile(req, res);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Terjadi kesalahan server" });
//   }
// });
router.post("/changeProfile", verifyToken, auth.editProfile);

// router.get("/home", verifyToken, role("mahasiswa"), function (req, res, next) {
//   res.render("home", { title: "Home" });
// });

router.get("/", function (req, res, next) {
  res.render("login", { title: "Home" });
});

// router.get("/account", function (req, res, next) {
//   res.render("account", { title: "account" });
// });
// router.get("/editprofile", function (req, res, next) {
//   res.render("edit_profile", { title: "edit profile" });
// });
router.get("/editpassword", function (req, res, next) {
  res.render("edit_password", { title: "edit password" });
});
// router.get("/admin", function (req, res, next) {
//   res.render("admin", { title: "admin" });
// });

module.exports = router;