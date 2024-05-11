const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/index");

const form = (req, res) => {
  res.render("login");
};

const checklogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Menggunakan nama variabel lain untuk menyimpan hasil pencarian user
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: 86400 }
    );

    // Set cookie dengan token
    res.cookie("token", token, { httpOnly: true });


    // Redirect ke halaman sesuai dengan peran pengguna
    if (user.role == "mahasiswa") {
      return res.redirect("/mahasiswa/home");
    } else if (user.role == "admin") {
      return res.redirect("/admin/dashboard");
    } else {
      res.status(200).send({ auth: true, token: token });
    }

    console.log(user.role);
  } catch (err) {
    console.error("Error during login: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

function logout(req, res) {
  res.clearCookie("token");
  res.redirect("/login");
}

module.exports = {
  checklogin,
  logout,
  form
};
