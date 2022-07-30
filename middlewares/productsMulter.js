const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: (req, file, cb) => {
        let nameFile = '/products/' + 'product-img-' + Date.now() + path.extname(file.originalname);
        cb(null, nameFile);
    }
});

const upload = multer({ storage });

module.exports = upload;