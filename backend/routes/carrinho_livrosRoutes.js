
const express = require('express');
const router = express.Router();
const carrinho_livrosController = require('./../controllers/carrinho_livrosController');

// CRUD de Carrinho_livross
// Rotas para a PK composta: carrinho_id e livro_id
router.get('/:id_carrinho/:id_livro', carrinho_livrosController.obterCarrinho_livros);
router.put('/:id_carrinho/:id_livro', carrinho_livrosController.atualizarCarrinho_livros);
router.delete('/:id_carrinho/:id_livro', carrinho_livrosController.deletarCarrinho_livros);

// Outras rotas sem a PK composta
// router.get('/abrirCrudCarrinho_livros', carrinho_livrosController.abrirCrudCarrinho_livros);
router.get('/', carrinho_livrosController.listarCarrinho_livross);


// Rota para obter todos os itens de um carrinho específico
router.get('/:idCarrinho', carrinho_livrosController.obterItensDeUmCarrinho_livros);
router.post('/', carrinho_livrosController.criarCarrinho_livros);

module.exports = router;
