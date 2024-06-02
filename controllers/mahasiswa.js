const { User, Mahasiswa } = require("../models/index");
const upload = require('../middleware/multerConfig');


const changeProfile = async (req, res) => {
  const user = await User.findByPk(req.userId);
  const mahasiswa = await Mahasiswa.findOne({ where: { userId: req.userId } });
  res.render("./mahasiswa/edit_profile", { user, mahasiswa });
};

const detail = async (req, res) => {
  const user = await User.findByPk(req.userId);
  const mahasiswa = await Mahasiswa.findOne({ where: { userId: req.userId } });
  res.render("./mahasiswa/account", { user, mahasiswa });
};

const editProfile = async (req, res, next) => {
  try {
    const { alamat } = req.body;
    const userId = req.userId;
    const mahasiswa = await Mahasiswa.findOne({ where: { userId: userId } });

    if (!mahasiswa) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }

    mahasiswa.alamat = alamat;
    await mahasiswa.save();

    res.status(200).json({ message: "profil berhasil diubah" });
  } catch (error) {
    next(error);
  }
};

const uploadProfilePicture = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json({ message: 'File uploaded successfully', file: `data/user_${req.userId}/${req.file.filename}` });
  });
};

module.exports = {
  changeProfile,
  editProfile,
  detail,
  uploadProfilePicture
};