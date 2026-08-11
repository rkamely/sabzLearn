const path = require("path");
const multer = require("multer");

module.exports = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, "..", "public", "courses", "covers");

    if (req.baseUrl.includes("/v1/article")) {
      uploadPath = path.join(__dirname, "..", "public", "articles", "covers");
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const fileName = Date.now() + String(Math.random() * 9999);
    const ext = path.extname(file.originalname);
    cb(null, fileName + ext);
  },
});
