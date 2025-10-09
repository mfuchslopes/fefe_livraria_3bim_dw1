
const express = require('express');
const router = express.Router();
const livro_generoController = require('./../controllers/livro_generoController');

// CRUD de Livro_generos
// Rotas para a PK composta: genero_id e livro_id
router.get('/:id_genero/:id_livro', livro_generoController.obterLivro_genero);
//router.put('/:id_genero/:id_livro', livro_generoController.atualizarLivro_genero);
router.delete('/:id_genero/:id_livro', livro_generoController.deletarLivro_genero);

// Outras rotas sem a PK composta
// router.get('/abrirCrudLivro_genero', livro_generoController.abrirCrudLivro_genero);
router.get('/', livro_generoController.listarLivro_generos);


// Rota para obter todos os itens de um genero específico
router.get('/:idGenero', livro_generoController.obterItensDeUmLivro_genero);
router.post('/', livro_generoController.criarLivro_genero);

module.exports = router;
