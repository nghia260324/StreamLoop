const multer = require("multer");
const path = require("path");

const videosPath = path.resolve(__dirname, "./temp");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`🛠️  Đang lưu file "${file.originalname}" vào thư mục: ${videosPath}`);
    cb(null, videosPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    console.log(`📝 Đặt tên file upload: ${uniqueName}`);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
