const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/index");

const form = (req, res) => {
  res.render("login");
};

const checklogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: 86400 }
    );
    res.cookie("token", token, { httpOnly: true });
    let redirectUrl = "/";
    if (user.role === "mahasiswa") {
      redirectUrl = "/mahasiswa/home";
    } else if (user.role === "admin") {
      redirectUrl = "/admin/dashboard";
    } else if (user.role === "lptik") {
      redirectUrl = "/lptik/home";
    }
    return res
      .status(200)
      .json({ auth: true, token: token, redirectUrl: redirectUrl });
  } catch (err) {
    console.error("Error during login: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
function logout(req, res) {
  res.clearCookie("token");
  res.redirect("/auth/login");
}

module.exports = {
  checklogin,
  logout,
  form,
};
