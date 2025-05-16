const fs = require("fs");
const path = require("path");

const dbPath = path.resolve(__dirname, "../videoDB.json");
// Đảm bảo file tồn tại
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, "[]", "utf-8");

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Thêm video
function addVideo(name, fullPath) {
  const db = readDB();
  const id = db.length ? db[db.length - 1].id + 1 : 1;
  const video = { id, name, path: fullPath, selected: false };
  db.push(video);
  writeDB(db);
  return video;
}

// Lấy tất cả video
function getVideos() {
  return readDB();
}

// Xoá video theo ID
function deleteVideoById(id) {
  let db = readDB();
  const video = db.find(v => v.id === id);
  if (!video) return null;

  db = db.filter(v => v.id !== id);
  writeDB(db);
  return video;
}

function getVideos() {
  return readDB();
}

function setSelected(id) {
  const db = readDB();
  const updated = db.map(video => ({
    ...video,
    selected: video.id === id
  }));
  writeDB(updated);
}

function getSelected() {
  const db = readDB();
  return db.find(video => video.selected);
}

module.exports = {
  addVideo,
  getVideos,
  deleteVideoById,
  setSelected,
  getSelected
};