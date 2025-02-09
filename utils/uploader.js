const path = require('path')
const multer = require('multer')

module.exports = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'courses', 'covers'))
  },
  filename: (req, file, cb) => {
    // const fileName = new Date() + (Math.random() * 1000).toString();
    const hashedFileName = crypto.createHash("SHA256").update(file.originalname).digest("hex");
    const ext = path.extname(file.originalname);
    cb(null, hashedFileName + ext)
  }
})