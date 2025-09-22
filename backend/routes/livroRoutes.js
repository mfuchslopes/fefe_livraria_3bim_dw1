const express = require('express');
const router = express.Router();
const livroController = require('./../controllers/livroController');

// CRUD de Livros

router.get('/abrirCrudLivro', livroController.abrirCrudLivro);
router.get('/', livroController.listarLivros);
router.post('/', livroController.criarLivro);
router.get('/:id', livroController.obterLivro);
router.put('/:id', livroController.atualizarLivro);
router.delete('/:id', livroController.deletarLivro);

module.exports = router;
