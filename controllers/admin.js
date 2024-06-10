const { Permohonan, User, Mahasiswa } = require("../models/index");

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
      attributes: ["id", "departemen_tujuan", "createdAt", "updatedAt"],
    });

    res.render("./admin/request", { permohonanList, title: "Request" });
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
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listPermohonan,
  getPermohonanDetail,
};
