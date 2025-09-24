const express = require('express');
const router = express.Router();
const livro_autorController = require('./../controllers/livro_autorController');

// CRUD de livros e autores

router.get('/abrirCrudLivro_autor', livro_autorController.abrirCrudLivro_autor);
router.get('/', livro_autorController.listarLivro_autor);
router.post('/:id', livro_autorController.criarLivro_autor);
router.get('/:id', livro_autorController.obterLivro_autorList);
//  router.put('/:id', livro_autorController.atualizarAvaliacao);
//  router.delete('/:id', livro_autorController.deletarAvaliacao);

module.exports = router;
