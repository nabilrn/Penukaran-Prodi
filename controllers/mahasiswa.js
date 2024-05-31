
const { User } = require("../models/index");

const changeProfile = async (req, res) => {
    const user = await User.findByPk(req.userId);
    res.render("./mahasiswa/edit_profile", { user });
  };
const view_profile = async (req, res) => {
    const profile = await User.findByPk(req.userId);
    res.render("./mahasiswa/account", { profile });
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
module.exports = {
    changeProfile,
    view_profile,
    editProfile,
}