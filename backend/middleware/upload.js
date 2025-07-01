const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pasta onde as imagens vão ser salvas
const uploadDir = 'uploads/prints';

// Cria a pasta uploads/prints se não existir
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `print_${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite 5MB
    fileFilter: function (req, file, cb) {
        // Aceita jpeg, jpg, png e webp
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Apenas imagens JPG, JPEG, PNG e WEBP são permitidas'));
        }
    },
});

module.exports = upload;