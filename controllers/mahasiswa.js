const { User, Mahasiswa, Permohonan } = require("../models/index");
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
const submitPermohonanPindah = async (req, res, next) => {
  try {
    const { tahunAjaran, semester, alasan, departemen_tujuan } = req.body;
    const userId = req.userId;

    // Cek apakah data mahasiswa sudah ada
    let mahasiswa = await Mahasiswa.findOne({ where: { userId: userId } });
    if (!mahasiswa) {
      return res.status(404).json({ message: "Data mahasiswa tidak ditemukan" });
    }

    // Cek apakah permohonan sebelumnya sudah selesai
    let previousPermohonan = await Permohonan.findOne({ 
      where: { mahasiswa_id: mahasiswa.id }, 
      order: [ [ 'createdAt', 'DESC' ]],
    });
    if (previousPermohonan && previousPermohonan.status !== 'selesai') {
      return res.status(400).json({ message: "Permohonan sebelumnya belum selesai" });
    }

    // Simpan permohonan pindah ke database
    const permohonan = await Permohonan.create({
      mahasiswa_id: mahasiswa.id,
      tahunAjaran: tahunAjaran,
      semester: semester,
      alasan: alasan,
      departemen_tujuan: departemen_tujuan,
    });

    res.status(200).json({ message: "Permohonan pindah berhasil disimpan", permohonan: permohonan });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  changeProfile,
  editProfile,
  detail,
  uploadProfilePicture,
  submitPermohonanPindah
};