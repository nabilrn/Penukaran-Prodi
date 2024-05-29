var express = require("express");
var router = express.Router();
const auth = require("../controllers/auth.js");

const verifyToken = require("../middleware/validToken.middleware.js");
const isLogin = require("../middleware/islogin.middleware.js");
const changePassword = require("../controllers/changePassword.js");

router.get("/login", isLogin, auth.form);

router.get("/", function (req, res, next) {
  res.render("login", { title: "Home" });
});
router.get("/editpassword", function (req, res, next) {
  res.render("edit_password", { title: "edit password" });
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


module.exports = router;
