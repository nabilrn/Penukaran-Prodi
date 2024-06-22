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
              attributes: ['departemen_tujuan', 'createdAt', 'updatedAt', 'status'],
              separate: true,
              order: [['createdAt', 'DESC']],
              limit: 1,  // Fetch only the latest Permohonan
            },
            {
              model: User,
              attributes: ['nama', 'username'],
            },
          ],
        },
        {
          model: Permohonan,
          attributes: ['departemen_tujuan'],
        }
      ],
      attributes: ['id', 'bpBaru', 'createdAt', 'updatedAt', 'status'],
    });

    res.render('lptik/home', { permohonanBps, title: 'Home', formatDate });
  } catch (error) {
    next(error);
  }
};



const updateNim = async (req, res) => {
  const { nimBaru, permohonanBpId } = req.body;
  const io = req.app.get("io"); 
  try {
    // Check if the new NIM is the same as an existing username
    const existingUser = await User.findOne({ where: { username: nimBaru } });
    if (existingUser) {
      return res.status(400).json({ error: 'NIM cannot be the same as an existing username' });
    }

    const permohonanBp = await PermohonanBp.findByPk(permohonanBpId, {
      include: [{ model: Mahasiswa, include: [User] }],
    });
    if (!permohonanBp) {
      return res.status(404).json({ error: 'PermohonanBp not found' });
    }
    permohonanBp.bpBaru = nimBaru;
    permohonanBp.status = 'selesai';
    await permohonanBp.save();
    const mahasiswaUserId = permohonanBp.Mahasiswa.User.id;
    const notification = await Notification.create({
      userId: mahasiswaUserId,
      judul: 'Pemberitahuan Nim Baru Mahasiswa',
      detail: `Nim baru untuk mahasiswa dengan no BP ${permohonanBp.Mahasiswa.User.username} adalah ${nimBaru}`,
    });
    io.to('user_6').emit('newNotification', notification);
    res.status(200).json({ message: 'NIM updated successfully' });
  } catch (error) {
    console.error('Error updating NIM:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { 
  getAllPermohonanBp,
  updateNim,
};
