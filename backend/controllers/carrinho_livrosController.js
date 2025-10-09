//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');

// exports.abrirCrudCarrinho_livros = (req, res) => {
//  // console.log('carrinho_livrosController - Rota /abrirCrudCarrinho_livros - abrir o crudCarrinho_livros');
//   res.sendFile(path.join(__dirname, '../../frontend/carrinho_livros/carrinho_livros.html'));
// }

exports.listarCarrinho_livross = async (req, res) => {
  try {
    const result = await query('SELECT * FROM carrinho_livros ORDER BY id_carrinho');
   // console.log('Resultado do SELECT:', result.rows);//verifica se está retornando algo
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar carrinho_livros:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


///////////////////////////////////////////////////////////////////// 
// Função para criar um novo item de carrinho no banco de dados.
exports.criarCarrinho_livros = async (req, res) => {
  try {
    const { id_carrinho, id_livro, quant_livro } = req.body;

    // Verifica se os dados necessários foram fornecidos.
    if (!id_carrinho || !id_livro || !quant_livro) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios: id_carrinho, id_livro, quant_livro, preco_unitario.' });
    }

    // Você pode adicionar mais verificações aqui, por exemplo,
    // se o carrinho e o livro existem.

    // Executa a query de inserção.
    const result = await query(
      'INSERT INTO carrinho_livros (id_carrinho, id_livro, quant_livro) VALUES ($1, $2, $3) RETURNING *',
      [id_carrinho, id_livro, quant_livro]
    );


    // Retorna o item recém-criado.
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar carrinho_livros:', error);

    // Trata erros de PK duplicada (se a combinação de carrinho_id e livro_id já existe).
    if (error.code === '23505') {
      return res.status(409).json({ error: 'O item do carrinho já existe. Use a função de atualização para modificar.' });
    }

    // Trata erros de foreign key (se o carrinho ou livro não existirem).
    if (error.code === '23503') {
      return res.status(400).json({ error: 'O ID do carrinho ou do livro não existe.' });
    }

    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};


/////////////////////////////////////////////////////////////////////
// função para obter itens de um carrinho específico
/////////////////////////////////////////////////////////////////////

exports.obterItensDeUmCarrinho_livros = async (req, res) => {
  try {
    console.log("Requisição recebida para obter itens de um carrinho especifico: rota carrinho_livros/:idCarrinho");
    // 1. Extrai o ID do carrinho dos parâmetros da requisição
    const { idCarrinho } = req.params;

    // 2. A query SQL com o parâmetro seguro ($1)
    const result = await query(
      'SELECT cl.id_carrinho , cl.id_livro , l.nome_livro , cl.quant_livro , l.preco' +
      ' FROM carrinho_livros cl, livro l ' +
      ' WHERE cl.id_carrinho = $1 and  cl.id_livro = l.id_livro ORDER BY cl.id_livro;',
      [idCarrinho]
    );

    // 4. Verifica se foram encontrados itens
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Nenhum item encontrado para este carrinho.' });
    }

    // 5. Retorna os itens encontrados
    res.status(200).json(result.rows);

  } catch (error) {
    // 6. Em caso de erro, retorna uma mensagem de erro genérica
    console.error('Erro ao obter itens do carrinho:', error);
    res.status(500).json({ message: 'Erro ao processar a requisição.', error: error.message });
  }
};

exports.obterCarrinho_livros = async (req, res) => {
  try {
    console.log("Requisição recebida para obter carrinho_livros (chave composta): rota carrinho_livros/:id_carrinho/:id_livro");
    
    //chave composta id_carrinho e id_livro
    const { id_carrinho, id_livro } = req.params;
    const idCarrinho = parseInt(id_carrinho);
    const idLivro = parseInt(id_livro);

    //console.log("estou no obter carrinho_livros =>" + " IdCarrinho=" + idCarrinho + " idLivro= " + idLivro);
    // Verifica se ambos os IDs são números válidos
    if (isNaN(idCarrinho) || isNaN(idLivro)) {
      return res.status(400).json({ error: 'IDs devem ser números válidos' });
    }

    const result = await query(
      'SELECT cl.id_carrinho , cl.id_livro , l.nome_livro , cl.quant_livro , l.preco' +
      ' FROM carrinho_livros cl, livro l ' +
      ' WHERE cl.id_carrinho = $1 AND cl.id_livro=$2 AND cl.id_livro = l.id_livro' +
      ' ORDER BY cl.id_carrinho;',
      [idCarrinho, idLivro]
    );

    //console.log(result)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Carrinho_livros não encontrado' });
    }

    res.json(result.rows); //retorna todos os itens do carrinho
  } catch (error) {
    console.error('Erro ao obter carrinho_livros:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.atualizarCarrinho_livros = async (req, res) => {
  try {
    // Imprime todos os parâmetros da requisição para debugar
    console.log("---------------rota atualizar livro ------------------------");
    // console.log("Requisição recebida para atualizar item:");
    // console.log("Parâmetros da URL (req.params):", req.params);
    // console.log("Corpo da requisição (req.body):", req.body);
    // console.log("---------------------------------------");

    // Extraímos ambos os IDs dos parâmetros da requisição, considerando a PK composta
    const { id_carrinho, id_livro } = req.params;
    const dadosParaAtualizar = req.body;

    //    console.log("id_carrinho:", id_carrinho, "id_livro:", id_livro);
    //    console.log("dadosParaAtualizar:", dadosParaAtualizar);

    // Verifica se ambos os IDs são números válidos
    if (isNaN(parseInt(id_carrinho)) || isNaN(parseInt(id_livro))) {
      return res.status(400).json({ error: 'IDs devem ser números válidos' });
    }

    // Verifica se a carrinho_livros existe  


    // Verifica se a carrinho_livros existe
    const existingPersonResult = await query(
      'SELECT * FROM carrinho_livros WHERE id_carrinho = $1 AND id_livro = $2',
      [id_carrinho, id_livro]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Carrinho_livros não encontrado' });
    }

    // Constrói a query de atualização dinamicamente para campos id_carrinho, id_livro, quant_livro, preco_unitario  
    const updatedFields = {};
    if (dadosParaAtualizar.quant_livro !== undefined) {
      updatedFields.quant_livro = dadosParaAtualizar.quant_livro;
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo válido para atualizar' });
    }

    // console.log("Campos a serem atualizados:", updatedFields);
    //  console.log("ID da carrinho_livros a ser atualizada:", id_carrinho, id_livro);


    // Atualiza a carrinho_livros
    const updateResult = await query( // Ajuste na query para considerar a PK composta
      'UPDATE carrinho_livros SET quant_livro = $1 WHERE id_carrinho = $2 AND id_livro = $3 RETURNING *',
      [updatedFields.quant_livro, id_carrinho, id_livro]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar carrinho_livros:', error);


    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.deletarCarrinho_livros = async (req, res) => {
  try {
    // 1. Extraímos ambos os IDs da chave primária composta da URL
    const { id_carrinho, id_livro } = req.params;

    // Imprime os IDs para depuração
    console.log("---------------- rota deletar carrinho -----------------------");
    // console.log("Requisição recebida para deletar item:");
    // console.log("Parâmetros da URL (req.params):", req.params);
    // console.log("---------------------------------------");

    // 2. Verifica se ambos os IDs são números válidos
    if (isNaN(parseInt(id_carrinho)) || isNaN(parseInt(id_livro))) {
      return res.status(400).json({ error: 'IDs de carrinho e livro devem ser números válidos.' });
    }

    // 3. Verifica se o item do carrinho existe antes de tentar deletar
    const existingItemResult = await query(
      'SELECT * FROM carrinho_livros WHERE id_carrinho = $1 AND id_livro = $2',
      [id_carrinho, id_livro]
    );

    if (existingItemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Item do carrinho não encontrado.' });
    }

    // 4. Deleta o item usando a chave primária composta
    const deleteResult = await query(
      'DELETE FROM carrinho_livros WHERE id_carrinho = $1 AND id_livro = $2',
      [id_carrinho, id_livro]
    );

    // Se a deleção foi bem-sucedida (uma linha afetada), retorna 204
    if (deleteResult.rowCount > 0) {
      res.status(204).send();
    } else {
      // Caso raro, se a verificação inicial passou mas a deleção não afetou nenhuma linha
      res.status(404).json({ error: 'Item do carrinho não encontrado para exclusão.' });
    }

  } catch (error) {
    console.error('Erro ao deletar item do carrinho:', error);

    // A maioria dos erros aqui será interna, já que a verificação de FK não se aplica
    // diretamente, pois a tabela de junção não tem dependentes.
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

