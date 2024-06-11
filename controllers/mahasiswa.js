const { User, Mahasiswa, Permohonan } = require("../models/index");
const upload = require("../middleware/multerConfig");

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

const history = async (req, res) => {
  const user = await User.findByPk(req.userId);
  const mahasiswa = await Mahasiswa.findOne({ where: { userId: req.userId } });
  const permohonan = await Permohonan.findAll({
    where: { mahasiswa_id: mahasiswa.id },
  });
  res.render("./mahasiswa/history", {
    user,
    mahasiswa,
    permohonan,
    title: "History",
  });
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
    return res.status(200).json({
      message: "File uploaded successfully",
      file: `data/user_${req.userId}/${req.file.filename}`,
    });
  });
};
const submitPermohonanPindah = async (req, res, next) => {
  try {
    const { tahunAjaran, semester, alasan, departemen_tujuan } = req.body;
    const userId = req.userId;

    // Cek apakah data mahasiswa sudah ada
    let mahasiswa = await Mahasiswa.findOne({ where: { userId: userId } });
    if (!mahasiswa) {
      return res
        .status(404)
        .json({ message: "Data mahasiswa tidak ditemukan" });
    }
    if (semester <= 2) {
      return res
        .status(400)
        .json({ message: "Belum Menyelesaikan 2 semester perkuliahan" });
    }

    if (mahasiswa.departemen === departemen_tujuan) {
      return res.status(400).json({
        message:
          "Tidak bisa melakukan permohonan pindah ke jurusan yang sama dengan saat ini",
      });
    }

    let previousPermohonan = await Permohonan.findOne({
      where: { mahasiswa_id: mahasiswa.id },
      order: [["createdAt", "DESC"]],
    });
    if (previousPermohonan && previousPermohonan.status !== "selesai") {
      return res
        .status(400)
        .json({ message: "Permohonan sebelumnya belum selesai" });
    }

    const permohonan = await Permohonan.create({
      mahasiswa_id: mahasiswa.id,
      tahunAjaran: tahunAjaran,
      semester: semester,
      alasan: alasan,
      departemen_tujuan: departemen_tujuan,
    });

    res.status(200).json({
      message: "Permohonan pindah berhasil disimpan",
      permohonan: permohonan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitPermohonanPindah,
};

const deletePermohonan = async (req, res, next) => {
  try {
    console.log("Request body:", req.body); // Log the request body to verify permohonanId presence
    const permohonanId = req.body.permohonanId;
    if (!permohonanId) {
      return res.status(400).json({ message: "permohonanId is required" });
    }
    const permohonan = await Permohonan.findByPk(permohonanId);
    console.log("Found permohonan:", permohonan); // Log the found permohonan for debugging

    if (!permohonan) {
      return res.status(404).json({ message: "Permohonan tidak ditemukan" });
    }

    if (permohonan.mahasiswa_id !== req.userId) {
      return res.status(403).json({ message: "Akses ditolak" });
    }
    await permohonan.destroy();
    res.status(200).json({ message: "Permohonan berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting permohonan:", error); // Log any errors encountered
    next(error);
  }
};

const editPermohonan = async (req, res, next) => {
  try {
    const { permohonanId, tahunAjaran, semester, alasan, departemen_tujuan } =
      req.body;
    const permohonan = await Permohonan.findByPk(permohonanId);
    if (!permohonan) {
      return res.status(404).json({ message: "Permohonan tidak ditemukan" });
    }
    const mahasiswa = await Mahasiswa.findOne({
      where: { userId: req.userId },
    });
    if (permohonan.mahasiswa_id !== mahasiswa.id) {
      return res.status(403).json({ message: "Akses ditolak" });
    }
    if (mahasiswa.departemen === departemen_tujuan) {
      return res.status(400).json({
        message: "Tidak bisa memilih jurusan yang sama dengan saat ini",
      });
    }
    permohonan.tahunAjaran = tahunAjaran;
    permohonan.semester = semester;
    permohonan.alasan = alasan;
    permohonan.departemen_tujuan = departemen_tujuan;
    await permohonan.save();

    res.status(200).json({ message: "Permohonan berhasil diubah", permohonan });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  deletePermohonan,
  history,
  changeProfile,
  editProfile,
  detail,
  uploadProfilePicture,
  submitPermohonanPindah,
  editPermohonan,
};
