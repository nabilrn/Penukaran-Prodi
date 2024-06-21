const { Permohonan, User, Mahasiswa, Notification, Feedback,} = require("../models/index");
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
    console.log("ID received:", id); // Debugging statement

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
      ],
    });

    if (!permohonanDetail) {
      return res.status(404).send("Permohonan not found");
    }

    res.render("./admin/permohonanDetail", {
      permohonanDetail,
      title: "Request Detail",
      permohonanId: permohonanDetail.id
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

    // Create a new PermohonanBp record using mahasiswa.userId
    const permohonanBp = await PermohonanBp.create({
      mahasiswaId: mahasiswa.id, // Use mahasiswa's id to establish the relationship
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
      permohonanBpId: permohonanBp.id, // Include the id of the new PermohonanBp record
    });
  } catch (error) {
    next(error);
  }
};

const getNotif = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null; // Pastikan req.user tersedia atau null jika tidak ada

    const notifications = await Notification.findAll({
      where: {
        judul: "Pemberitahuan Nim Baru Mahasiswa",
      },
      order: [["createdAt", "DESC"]], // Order by creation date descending
    });
    res.render("./admin/notif", {
      notifications,
      title: "Notification",
      formatDate,
      formatTime,
      userId, // Kirim userId ke template
    });
  } catch (error) {
    console.error("Error fetching notifications: ", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

const updateUsername = async (req, res, next) => {
  try {
    let { permohonanBpId, nimBaru } = req.body;

    // Log the incoming permohonanBpId and nimBaru for debugging
    console.log("Received permohonanBpId:", permohonanBpId);
    console.log("Received nimBaru:", nimBaru);

    // Convert permohonanBpId to integer if necessary
    permohonanBpId = parseInt(permohonanBpId, 10);

    if (isNaN(permohonanBpId)) {
      return res.status(400).json({ message: "Invalid permohonanBpId" });
    }

    // Find the corresponding PermohonanBp record with Mahasiswa and User included
    const permohonanBp = await PermohonanBp.findByPk(permohonanBpId, {
      include: [{ model: Mahasiswa, include: User }],
    });

    if (!permohonanBp) {
      return res.status(404).json({ message: "Permohonan BP not found" });
    }

    // Check if permohonanBp.Mahasiswa and permohonanBp.Mahasiswa.User are defined
    if (!permohonanBp.Mahasiswa || !permohonanBp.Mahasiswa.User) {
      return res.status(404).json({ message: "Mahasiswa or User not found" });
    }

    // Update the username (NIM Baru) of the associated User
    await permohonanBp.Mahasiswa.User.update({ username: nimBaru });

    // Find Permohonan associated with Mahasiswa
    const permohonan = await Permohonan.findOne({
      where: { mahasiswa_id: permohonanBp.Mahasiswa.id },
    });

    if (!permohonan) {
      return res.status(404).json({ message: "Permohonan not found" });
    }

    // Update status in Permohonan model to 'selesai' and departemen in Mahasiswa model
    await permohonan.update({
      status: "selesai",
    });

    await permohonanBp.Mahasiswa.update({
      departemen: permohonan.departemen_tujuan,
    });

    // Create a new notification for the user
    const notification = await Notification.create({
      userId: permohonanBp.Mahasiswa.User.id,
      judul: "Nomor BP Anda Telah Berubah",
      detail:
        "Selamat Anda Telah Pindah Ke Prodi Yang Baru. Silahkan Ambil Surat Keterangan Pindah Prodi ke admin Departemen Bersangkutan.",
    });

    // Emit the notification event via socket
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
  listPermohonan,
  acceptPermohonan,
  rejectPermohonan,
  getPermohonanDetail,
  getNotif,
  updateUsername,
  getAllFeedback,
};
