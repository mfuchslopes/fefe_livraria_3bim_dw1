const express = require('express');
const router = express.Router();
const generoController = require('../controllers/generoController');

// CRUD de generos

router.get('/abrirCrudGenero', generoController.abrirCrudGenero);
router.get('/', generoController.listarGeneros);
router.post('/', generoController.criarGenero);
router.get('/:id', generoController.obterGenero);
router.put('/:id', generoController.atualizarGenero);
router.delete('/:id', generoController.deletarGenero);

module.exports = router;
