const bcrypt = require("bcrypt");
const { User } = require("../models/index");

const changePassword = async (req, res) => {
    try {
      const {  currentPassword, newPassword } = req.body;
      const user = await User.findByPk(req.userId);
      console.log(user)
        if (!user) {
          return res.status(404).json({ message: "Pengguna tidak ditemukan" });
        }
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Password saat ini salah" });
        }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedNewPassword });
        return res.status(200).json({ message: "Password berhasil diubah" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  };

  module.exports={
    changePassword
  };