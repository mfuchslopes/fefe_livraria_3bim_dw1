const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const utilController = require('../controllers/utilController');

// Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../frontend/img'));
  },
  filename: (req, file, cb) => {

    console.log([...file.originalname].map(c => c.charCodeAt(0)));

    let slug = file.originalname;
    cb(null, `${slug}.jpg`);
  }
});



const upload = multer({ storage });

// rota principal de upload
router.post('/upload-imagem', upload.single('imagem'), (req, res, next) => {
  console.log("Arquivo recebido pelo multer:", req.file);
  next();
}, utilController.uploadImagem);

module.exports = router;