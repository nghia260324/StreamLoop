var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");
const upload = require("../upload");
const videoDB = require("../models/videoDB");
const ffmpeg = require("fluent-ffmpeg");
let selectedVideo = null;

const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
const { startStream, stopStream } = require("../livestream/streamer");

router.get("/", (req, res) => {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    console.log("📁 Đã tạo thư mục 'videos'");
  }

  const files = fs.readdirSync(tempDir).filter(f =>
    /\.(mp4|mkv|mov|avi)$/i.test(f)
  );

  res.render("home", { videos: files });
});


router.post('/upload', upload.array('video'), (req, res) => {
  const files = req.files;

  if (!files || !files.length) return res.status(400).send("No files uploaded");

  const added = files.map(file => {
    const fullPath = file.path;
    const saved = videoDB.addVideo(file.filename, fullPath);
    return saved;
  });
  res.status(200).json({ success: true });
});

// Route lấy danh sách video
router.get('/videos', (req, res) => {
  const list = videoDB.getVideos();
  res.json(list);
});



router.post("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const video = videoDB.deleteVideoById(id);

  if (!video) return res.status(404).send("Not found");

  fs.unlink(video.path, (err) => {
    if (err) console.warn("Lỗi xoá file:", err.message);
    res.send("Deleted");
  });
});


router.post("/select/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const all = videoDB.getVideos();
  const selected = all.find(v => v.id === id);
  if (!selected) return res.status(404).send("Không tìm thấy video");

  videoDB.setSelected(id);
  res.send(`Đã chọn video "${selected.name}" để livestream`);
});

router.post("/start", (req, res) => {
  const selected = videoDB.getSelected();
  if (!selected) {
    return res.status(400).send("⚠️ Chưa chọn video để livestream.");
  }

  try {
    startStream(selected.path);
    res.send(`▶️ Đang livestream video: ${selected.name}`);
  } catch (err) {
    console.error("Lỗi khi livestream:", err);
    res.status(500).send("❌ Không thể bắt đầu livestream.");
  }
});
router.post("/stop", (req, res) => {
  try {
    stopStream();
    res.send("⏹️ Livestream đã được dừng.");
  } catch (err) {
    console.error("Lỗi khi dừng livestream:", err);
    res.status(500).send("❌ Không thể dừng livestream.");
  }
});



module.exports = router;