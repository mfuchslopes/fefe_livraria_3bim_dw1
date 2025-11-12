

const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/carrinhoController');


// Rota para retornar os carrinhos do usuário logado
router.get('/meusCarrinhos', carrinhoController.meusCarrinhos);

// Rota para criar novo carrinho (id gerado pelo banco)
router.post('/novo', carrinhoController.criarNovoCarrinho);

// CRUD de Carrinhos


router.get('/abrirCrudCarrinho', carrinhoController.abrirCrudCarrinho);
router.get('/', carrinhoController.listarCarrinho);
router.post('/', carrinhoController.criarCarrinho);
router.get('/:id', carrinhoController.obterCarrinho);
router.put('/:id', carrinhoController.atualizarCarrinho);
router.delete('/:id', carrinhoController.deletarCarrinho);

module.exports = router;
