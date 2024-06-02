const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const userId = req.userId; // Make sure this is set correctly
      const dir = path.join(__dirname, '../data', `user_${userId}`);
      
      // Ensure directory exists
      await fs.ensureDir(dir);
      
      cb(null, dir);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    cb(null, 'profile.jpg');
  }
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('profilePic'); // 'profilePic' is the name attribute in the form

module.exports = upload;
