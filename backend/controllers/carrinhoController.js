//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');

// // exports.abrirCrudCarrinho = (req, res) => {
// //   console.log('carrinhoController - Rota /abrirCrudCarrinho - abrir o crudCarrinho');
// //   res.sendFile(path.join(__dirname, '../../frontend/carrinho/carrinho.html'));
// // }

// // exports.listarCarrinhos = async (req, res) => {
// //   try {
// //     const result = await query('SELECT * FROM carrinho ORDER BY id_carrinho');
// //    //  console.log('Resultado do SELECT:', result.rows);//verifica se está retornando algo
// //     res.json(result.rows);
// //   } catch (error) {
// //     console.error('Erro ao listar carrinhos:', error);
// //     res.status(500).json({ error: 'Erro interno do servidor' });
// //   }
// //}


exports.criarCarrinho = async (req, res) => {
  //  console.log('Criando carrinho com dados:', req.body);
  try {
    const { id_carrinho, data_carrinho, id_pessoa} = req.body;

    // Validação básica
    if (!id_carrinho || !data_carrinho || !id_pessoa) {
      return res.status(400).json({
        error: 'id_carrinho, data_Carrinho e id_pessoa são obrigatórios'
      });
    }

    const result = await query(
      'INSERT INTO carrinho (id_carrinho, data_carrinho, id_pessoa) VALUES ($1, $2, $3) RETURNING *',
      [id_carrinho, data_carrinho, id_pessoa]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar carrinho:', error);

   

    // Verifica se é erro de violação de constraint NOT NULL
    if (error.code === '23502') {
      return res.status(400).json({
        error: 'Dados obrigatórios não fornecidos'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.obterCarrinho = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

   // console.log("estou no obter carrinho id="+ id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    const result = await query(
      'SELECT * FROM carrinho WHERE id_carrinho = $1',
      [id]
    );

    //console.log(result)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.atualizarCarrinho = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const { nome_carrinho, descricao_carrinho, preco, quant_estoque, data_lanc} = req.body;
    const imagem_carrinho = `/img/${id}.jpg`;

    // Verifica se o carrinho existe
    const existing = await query('SELECT * FROM carrinho WHERE id_carrinho = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }

    // Monta UPDATE dinâmico apenas com campos válidos
    const updates = [];
    const values = [];
    let idx = 1;

    if (nome_carrinho != null && String(nome_carrinho).trim() !== '') {
      updates.push(`nome_carrinho = $${idx++}`);
      values.push(String(nome_carrinho).trim());
    }

    if (descricao_carrinho != null && String(descricao_carrinho).trim() !== '') {
      updates.push(`descricao_carrinho = $${idx++}`);
      values.push(String(descricao_carrinho).trim());
    }

    updates.push(`imagem_carrinho = $${idx++}`);
    values.push(imagem_carrinho);

 // preco: aceitar número válido (float), >= 0
    if (preco != null && String(preco).trim() !== '') {
      const priceStr = String(preco).replace(',', '.').trim();
      const price = Number(priceStr);
      if (!Number.isFinite(price)) {
        return res.status(400).json({ error: 'preco deve ser um número válido' });
      }
      if (price < 0) {
        return res.status(400).json({ error: 'preco não pode ser negativo' });
      }
      updates.push(`preco = $${idx++}`);
      values.push(price);
    }


    // quantidade_estoque: aceitar apenas inteiro válido
    if (quant_estoque != null && String(quant_estoque).trim() !== '') {
      const qtyStr = String(quant_estoque).replace(',', '.').trim();
      const qty = Number(qtyStr);
      if (!Number.isInteger(qty)) {
        return res.status(400).json({ error: 'quant_estoque deve ser um inteiro válido' });
      }
      updates.push(`quant_estoque = $${idx++}`);
      values.push(qty);
    }

    // data_lanc: aceitar data válida no formato YYYY-MM-DD
    if (data_lanc != null && String(data_lanc).trim() !== '') {
      const date = new Date(String(data_lanc).trim());
      if (isNaN(date.getTime())) {
        return res.status(400).json({ error: 'data_lanc deve ser uma data válida' });
      }
      updates.push(`data_lanc = $${idx++}`);
      values.push(date);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo válido para atualizar' });
    }

    values.push(id);
    const sql = `UPDATE carrinho SET ${updates.join(', ')} WHERE id_carrinho = $${idx} RETURNING *`;

    const updateResult = await query(sql, values);
    return res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar carrinho:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};


exports.deletarCarrinho = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Verifica se a carrinho existe
    const existingPersonResult = await query(
      'SELECT * FROM carrinho WHERE id_carrinho = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Carrinho não encontrada' });
    }

    // Deleta a carrinho (as constraints CASCADE cuidarão das dependências)
    await query(
      'DELETE FROM carrinho WHERE id_carrinho = $1',
      [id]
    );

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar carrinho:', error);

    // Verifica se é erro de violação de foreign key (dependências)
    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Não é possível deletar carrinho com dependências associadas'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


