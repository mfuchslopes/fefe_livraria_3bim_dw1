const express = require('express');
const router = express.Router();
const autorController = require('../controllers/autorController');

// CRUD de autors

router.get('/abrirCrudAutor', autorController.abrirCrudAutor);
router.get('/', autorController.listarAutors);
router.post('/', autorController.criarAutor);
router.get('/:id', autorController.obterAutor);
router.put('/:id', autorController.atualizarAutor);
router.delete('/:id', autorController.deletarAutor);

module.exports = router;
