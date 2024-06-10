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
      attributes: ["departemen_tujuan", "createdAt", "updatedAt"],
    });

    res.render("./admin/request", { permohonanList, title: "Request" });
  } catch (error) {
    next(error);
  }
};

const getPermohonanDetail = async (req, res) => {
  try {
    const permohonanId = req.params.id;
    const permohonan = await Permohonan.findByPk(permohonanId, {
      include: [
        {
          model: Mahasiswa,
          include: {
            model: User,
            attributes: ['nama', 'username'],
          },
          attributes: ['departemen'],
        },
      ],
    });

    if (!permohonan) {
      return res.status(404).render('error', { message: 'Permohonan not found' });
    }

    // Render the permohonanDetail view with the retrieved data
    res.render('./admin/permohonanDetail', { permohonan });
  } catch (error) {
    console.error('Error fetching permohonan:', error);
    res.status(500).render('error', { message: 'An error occurred' });
  }
};


module.exports = {
  listPermohonan,
  getPermohonanDetail
};
