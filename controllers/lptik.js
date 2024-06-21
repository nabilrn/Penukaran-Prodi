const { PermohonanBp, Mahasiswa, Permohonan, User, Notification } = require("../models");

const getAllPermohonanBp = async (req, res, next) => {
  try {
    function formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
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
              attributes: ['departemen_tujuan', 'createdAt', 'updatedAt'],
            },
            {
              model: User,
              attributes: ['nama', 'username'],
            },
          ],
        },
      ],
      attributes: ['id', 'createdAt', 'updatedAt', 'status'],
    });

    res.render('lptik/home', { permohonanBps, title: 'Home', formatDate });
  } catch (error) {
    next(error);
  }
};

const updateNim = async (req, res) => {
  const { nimBaru, permohonanBpId } = req.body;
  const io = req.app.get("io"); // Get io instance from app

  try {
    const permohonanBp = await PermohonanBp.findByPk(permohonanBpId, {
      include: [{ model: Mahasiswa, include: [User] }],
    });

    if (!permohonanBp) {
      return res.status(404).send('PermohonanBp not found');
    }

    // Update bpBaru and status
    permohonanBp.bpBaru = nimBaru;
    permohonanBp.status = 'selesai';
    await permohonanBp.save();

    const mahasiswaUserId = permohonanBp.Mahasiswa.User.id;

    const notification = await Notification.create({
      userId: mahasiswaUserId,
      judul: 'Pemberitahuan Nim Baru Mahasiswa',
      detail: `Nim baru untuk mahasiswa dengan no BP ${permohonanBp.Mahasiswa.User.username} adalah ${nimBaru}`,
    });

    // Kirim notifikasi real-time kepada user dengan ID 6
    io.to('user_6').emit('newNotification', notification);

    res.redirect('/lptik/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};






module.exports = { 
  getAllPermohonanBp,
  updateNim,
};
