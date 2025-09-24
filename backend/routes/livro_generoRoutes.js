const express = require('express');
const router = express.Router();
const livro_generoController = require('./../controllers/livro_generoController');

// CRUD de livros e generoes

router.get('/abrirCrudLivro_genero', livro_generoController.abrirCrudLivro_genero);
router.get('/', livro_generoController.listarLivro_genero);
router.post('/:id', livro_generoController.criarLivro_genero);
router.get('/:id', livro_generoController.obterLivro_generoList);
//  router.put('/:id', livro_generoController.atualizarAvaliacao);
//  router.delete('/:id', livro_generoController.deletarAvaliacao);

module.exports = router;
