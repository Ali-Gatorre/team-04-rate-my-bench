const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = "uploads/avatars";

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const safeName = `${Date.now()}-avatar${extension}`;
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const uploadAvatar = multer({ storage, fileFilter });

module.exports = uploadAvatar;

