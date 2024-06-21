const {
  Permohonan,
  User,
  Mahasiswa,
  PermohonanBp,
  Notification,
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

    // Create a new PermohonanBp record using mahasiswaId
    const permohonanBp = await PermohonanBp.create({
      mahasiswaId: mahasiswa.id, // Use mahasiswa's id to establish the relationship
      status: "diajukan",
    });

    const notification = await Notification.create({
      userId: mahasiswa.userId,
      judul: "Permohonan diterima",
      detail: "Permohonan anda telah diterima.",
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
};
