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

const changeProfile = async (req, res) => {
  const user = await User.findByPk(req.userId);
  res.render("edit_profile", { user });
  // return user;
  // console.log(req.cookies.token)
};

const view_profile = async (req, res) => {
  const profile = await User.findByPk(req.userId);
  res.render("account", { profile });

};


const editProfile = async (req, res) => {
  try {
    const { newUsername } = req.body;
    if (!newUsername) {
      return res.status(400).json({ message: "Username baru tidak valid" });
    }

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    await user.update({ username: newUsername });

    return res.status(200).json({ message: "Profil berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating profile: ", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

function logout(req, res) {
  res.clearCookie("token");
  res.redirect("/login");
}

module.exports = {
  checklogin,
  logout,
  form,
  view_profile,
  editProfile,
  changeProfile,
};