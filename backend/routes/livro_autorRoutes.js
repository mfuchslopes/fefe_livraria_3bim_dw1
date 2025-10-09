
const express = require('express');
const router = express.Router();
const livro_autorController = require('./../controllers/livro_autorController');

// CRUD de Livro_autors
// Rotas para a PK composta: autor_id e livro_id
router.get('/:id_autor/:id_livro', livro_autorController.obterLivro_autor);
//router.put('/:id_autor/:id_livro', livro_autorController.atualizarLivro_autor);
router.delete('/:id_autor/:id_livro', livro_autorController.deletarLivro_autor);

// Outras rotas sem a PK composta
// router.get('/abrirCrudLivro_autor', livro_autorController.abrirCrudLivro_autor);
router.get('/', livro_autorController.listarLivro_autors);


// Rota para obter todos os itens de um autor específico
router.get('/:idAutor', livro_autorController.obterItensDeUmLivro_autor);
router.post('/', livro_autorController.criarLivro_autor);

module.exports = router;
