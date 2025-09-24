//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');

exports.abrirCrudLivro_autor = (req, res) => {
  console.log('livro_autor - Rota /abrirCrudLivro_autor');
  res.sendFile(path.join(__dirname, '../../frontend/livro_autor/livro_autor.html'));
}


 exports.listarLivro_autor = async (req, res) => {
   try {
     const result = await query('SELECT * FROM livro_autor');
    console.log('Resultado do SELECT:', result.rows);//verifica se está retornando algo
     res.json(result.rows);
   } catch (error) {
    console.error('Erro ao listar professor:', error);
     res.status(500).json({ error: 'Erro interno do servidor' });
  }
 }

exports.obterLivro_autorList = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    const result = await query(
        'SELECT livro.id_livro, livro.nome_livro, livro.imagem_livro FROM livro JOIN livro_autor ON livro.id_livro = livro_autor.id_livro WHERE livro_autor.id_autor=$1  ORDER BY livro.id_livro',      
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Autor não encontrada' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao obter livro_autor:', error);
    res.status(500).json({ error: 'Erro interno do servidor - livro_autor' });
  }
}

exports.criarLivro_autor = async (req, res) => {
  try {
    const autorId = parseInt(req.params.id);
    const { livros } = req.body; // array de ids de livros

    // Remove todos os livros existentes do autor
    await query('DELETE FROM livro_autor WHERE id_autor=$1', [autorId]);

    // Insere os novos livros
    for (let livroId of livros) {
      await query('INSERT INTO livro_autor (id_livro, id_autor) VALUES ($1, $2)', [livroId, autorId]);
    }

    res.json({ message: 'Livros salvos com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar livros do autor:', error);
    res.status(500).json({ error: 'Erro interno ao salvar livros' });
  }
};