const express = require('express');
const router = express.Router();
const departamentoController = require('../controllers/departamentoController');

// CRUD de departamentos

router.get('/abrirCrudDepartamento', departamentoController.abrirCrudDepartamento);
router.get('/', departamentoController.listarDepartamentos);
router.post('/', departamentoController.criarDepartamento);
router.get('/:id', departamentoController.obterDepartamento);
router.put('/:id', departamentoController.atualizarDepartamento);
router.delete('/:id', departamentoController.deletarDepartamento);

module.exports = router;
