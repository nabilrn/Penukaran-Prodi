var express = require("express");
var router = express.Router();
const verifyToken = require("../middleware/validtoken.middleware.js");
const role = require("../middleware/checkrole.middleware");
const lptik = require("../controllers/lptik.js");

router.get("/home", verifyToken, role("lptik"), lptik.getAllPermohonanBp);
router.get("/surat", verifyToken, role("lptik"), function (req, res, next) {
  res.render("./lptik/buatsurat", { title: "Buat Surat" });
});
router.post('/update-nim', verifyToken, lptik.updateNim);

module.exports = router;