const {
  Permohonan,
  User,
  Mahasiswa,
  Notification,
  PermohonanBp,
  Feedback,
} = require("../models/index");
const sequelize = require("sequelize");
const path = require("path");
const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const libre = require("libreoffice-convert");
const QRCode = require("qrcode");
const ImageModule = require("docxtemplater-image-module-free");

const listPermohonan = async (req, res, next) => {
  try {
    const permohonanList = await Permohonan.findAll({
      include: [
        {
          model: Mahasiswa,
          include: {
            model: User,
            attributes: ["nama", "username"],
          },
          attributes: ["departemen"],
        },
      ],
      attributes: [
        "id",
        "departemen_tujuan",
        "createdAt",
        "updatedAt",
        "status",
      ],
    });
    res.render("./admin/request", {
      permohonanList,
      title: "Request",
      formatDate,
    });
  } catch (error) {
    next(error);
  }
};

const getPermohonanDetail = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).send("Invalid ID");
    }
    const permohonanDetail = await Permohonan.findOne({
      where: { id },
      include: [
        {
          model: Mahasiswa,
          include: {
            model: User,
            attributes: ["nama", "username"],
          },
          attributes: ["departemen", "alamat"],
        },
      ],
      attributes: [
        "departemen_tujuan",
        "semester",
        "tahunAjaran",
        "createdAt",
        "updatedAt",
        "alasan",
        "status",
      ],
    });

    if (!permohonanDetail) {
      return res.status(404).send("Permohonan not found");
    }
    res.render("./admin/permohonanDetail", {
      permohonanDetail,
      permohonanId: id, // Pastikan permohonanId tersedia di template
      title: "Request Detail",
    });
  } catch (error) {
    next(error);
  }
};

const dataSurat = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).send("Invalid ID");
    }
    const suratData = await Permohonan.findOne({
      where: { id },
      include: [
        {
          model: Mahasiswa,
          include: {
            model: User,
            attributes: ["nama", "username"],
          },
          attributes: ["departemen"],
        },
      ],
    });
    if (!suratData) {
      return res.status(404).send("Permohonan not found");
    }
    res.render("./admin/buatsurat", {
      suratData,
      permohonanId: id,
      title: "Buat Surat",
    });
  } catch (error) {
    next(error);
  }
};

const rejectPermohonan = async (req, res, next) => {
  try {
    const { permohonanId, alasanPenolakan } = req.body;
    const userId = req.userId;
    const io = req.app.get("io");

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const permohonan = await Permohonan.findByPk(permohonanId);
    if (!permohonan) {
      return res.status(404).json({ message: "Permohonan tidak ditemukan." });
    }

    permohonan.status = "ditolak";
    await permohonan.save();

    const mahasiswa = await Mahasiswa.findByPk(permohonan.mahasiswa_id);
    if (!mahasiswa) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan." });
    }

    const notification = await Notification.create({
      userId: mahasiswa.userId,
      judul: "Permohonan anda ditolak",
      detail: `Maaf permohonan anda telah ditolak dengan alasan: ${alasanPenolakan}`,
    });

    io.to(mahasiswa.userId.toString()).emit("newNotification", notification);

    res.status(200).json({
      message: "Permohonan telah ditolak dan notifikasi telah dikirim.",
    });
  } catch (error) {
    next(error);
  }
};

const acceptPermohonan = async (req, res, next) => {
  try {
    const { permohonanId } = req.body;
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const permohonan = await Permohonan.findByPk(permohonanId);
    if (!permohonan) {
      return res.status(404).json({ message: "Permohonan tidak ditemukan." });
    }
    permohonan.status = "diterima";
    await permohonan.save();
    const mahasiswa = await Mahasiswa.findByPk(permohonan.mahasiswa_id);
    if (!mahasiswa) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan." });
    }
    const permohonanBp = await PermohonanBp.create({
      id: permohonan.id, // Mengatur id sama dengan id permohonan
      mahasiswaId: mahasiswa.id,
      permohonan_id: permohonan.id,
      status: "diajukan",
    });
    const notification = await Notification.create({
      userId: mahasiswa.userId,
      judul: "Permohonan diterima",
      detail: `Permohonan anda telah diterima.`,
    });
    const io = req.app.get("io");
    io.to(mahasiswa.userId.toString()).emit("newNotification", notification);
    res.status(200).json({
      message: "Permohonan telah diterima dan notifikasi telah dikirim.",
      permohonanBpId: permohonanBp.id,
    });
  } catch (error) {
    next(error);
  }
};


const getDashboardData = async (req, res, next) => {
  try {
    const countByStatus = await Permohonan.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("status")), "count"],
      ],
      group: ["status"],
    });
    const statusCounts = {
      diajukan: 0,
      diterima: 0,
      ditolak: 0,
      selesai: 0,
    };
    countByStatus.forEach((record) => {
      statusCounts[record.status] = record.getDataValue("count");
    });
    res.render("./admin/admin", {
      title: "Dashboard",
      statusCounts,
    });
  } catch (error) {
    next(error);
  }
};

const getNotif = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const notifications = await Notification.findAll({
      where: {
        judul: "Pemberitahuan Nim Baru Mahasiswa",
      },
      order: [["createdAt", "DESC"]],
    });
    res.render("./admin/notif", {
      notifications,
      title: "Notification",
      formatDate,
      formatTime,
      userId,
    });
  } catch (error) {
    console.error("Error fetching notifications: ", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

const getAllPermohonanBp = async (req, res, next) => {
  try {
    function formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    }

    const permohonanBps = await PermohonanBp.findAll({
      include: [
        {
          model: Mahasiswa,
          include: [
            {
              model: Permohonan,
              attributes: [
                "departemen_tujuan",
                "createdAt",
                "updatedAt",
                "status",
              ],
              separate: true,
              order: [["createdAt", "DESC"]],
              limit: 1,
            },
            {
              model: User,
              attributes: ["nama", "username"],
            },
          ],
        },
        {
          model: Permohonan,
          attributes: ["departemen_tujuan"],
        },
      ],
      attributes: ["id", "bpBaru", "createdAt", "updatedAt", "status"],
    });

    res.render("admin/history", {
      permohonanBps,
      title: "History",
      formatDate,
    });
  } catch (error) {
    next(error);
  }
};

const updateUsername = async (req, res, next) => {
  try {
    let { permohonanBpId, nimBaru } = req.body;
    console.log("Received permohonanBpId:", permohonanBpId);
    console.log("Received nimBaru:", nimBaru);
    permohonanBpId = parseInt(permohonanBpId, 10);

    if (isNaN(permohonanBpId)) {
      return res.status(400).json({ message: "Invalid permohonanBpId" });
    }
    const permohonanBp = await PermohonanBp.findByPk(permohonanBpId, {
      include: [{ model: Mahasiswa, include: User }, Permohonan],
    });
    if (!permohonanBp) {
      return res.status(404).json({ message: "Permohonan BP not found" });
    }
    if (!permohonanBp.Mahasiswa || !permohonanBp.Mahasiswa.User) {
      return res.status(404).json({ message: "Mahasiswa or User not found" });
    }
    await permohonanBp.Mahasiswa.User.update({ username: nimBaru });

    if (!permohonanBp.Permohonan) {
      return res.status(404).json({ message: "Permohonan not found" });
    }
    await permohonanBp.Permohonan.update({
      status: "selesai",
    });
    await permohonanBp.Mahasiswa.update({
      departemen: permohonanBp.Permohonan.departemen_tujuan,
    });
    const notification = await Notification.create({
      userId: permohonanBp.Mahasiswa.User.id,
      judul: "Nomor BP Anda Telah Berubah",
      detail:
        "Selamat Anda Telah Pindah Ke Prodi Yang Baru. Silahkan Ambil Surat Keterangan Pindah Prodi ke admin Departemen Bersangkutan.",
    });
    const io = req.app.get("io");
    io.to(permohonanBp.Mahasiswa.User.id.toString()).emit("newNotification", {
      judul: notification.judul,
      detail: notification.detail,
      createdAt: notification.createdAt,
    });
    res
      .status(200)
      .json({ message: "NIM successfully updated and notification sent" });
  } catch (error) {
    console.error("Error in updateUsername function:", error);
    next(error);
  }
};

const getAllFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.findAll();
    res.render("./admin/feedback", { feedbacks, title: "Feedback" });
  } catch (error) {
    next(error);
  }
};

const generatePdf = async (req, res) => {
  try {
    const { id } = req.params;
    const permohonanBp = await PermohonanBp.findOne({
      where: { id },
      include: [
        {
          model: Mahasiswa,
          include: [User],
        },
      ],
    });
    if (!permohonanBp) {
      return res.status(404).send("PermohonanBp not found");
    }
    const user = permohonanBp.Mahasiswa.User;
    const suratData = {
      id: permohonanBp.id,
      nama: user.nama,
      nim: user.username,
      departemen: permohonanBp.Mahasiswa.departemen,
    };
    const templatePath = path.join(__dirname, "../template.docx");
    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);
    const qrCodePath = path.join(
      __dirname,
      "../document/qrCode",
      `${user.nama}.png`
    );
    await QRCode.toFile(
      qrCodePath,
      `http://localhost:3000/pdf/${user.nama}.pdf`
    );
    const imageOpts = {
      centered: false,
      getImage: (tagValue) => fs.readFileSync(tagValue),
      getSize: () => [120, 120],
    };
    const imageModule = new ImageModule(imageOpts);
    const doc = new Docxtemplater(zip, {
      modules: [imageModule],
      paragraphLoop: true,
      linebreaks: true,
    });
    doc.setData({
      nama: suratData.nama,
      nim: suratData.nim,
      departemen: suratData.departemen,
      qrCode: qrCodePath,
    });
    try {
      doc.render();
    } catch (error) {
      console.error("Error rendering document:", error);
      return res.status(500).send(`Error rendering document: ${error.message}`);
    }
    const buf = doc.getZip().generate({ type: "nodebuffer" });
    libre.convert(buf, ".pdf", undefined, async (err, done) => {
      if (err) {
        console.error("Error converting document to PDF:", err);
        return res
          .status(500)
          .send(`Error converting document to PDF: ${err.message}`);
      }
      const pdfPath = path.join(
        __dirname,
        "../document/pdf",
        `${user.nama}.pdf`
      );
      fs.writeFileSync(pdfPath, done);
      try {
        const notificationDetail = `${user.nama}.pdf`;
        await Notification.create({
          userId: user.id,
          judul: "Surat Keterangan Pindah Prodi",
          detail: notificationDetail,
        });
      } catch (notificationError) {
        console.error("Error creating notification:", notificationError);
        return res
          .status(500)
          .send(`Error creating notification: ${notificationError.message}`);
      }
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${user.nama}.pdf`
      );
      res.send(done);
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).send(`Error generating PDF: ${error.message}`);
  }
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return day + " " + month + " " + year;
}

function formatTime(dateString) {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

module.exports = {
  generatePdf,
  dataSurat,
  updateUsername,
  getAllFeedback,
  getAllPermohonanBp,
  getNotif,
  listPermohonan,
  getDashboardData,
  acceptPermohonan,
  rejectPermohonan,
  getPermohonanDetail,
};
