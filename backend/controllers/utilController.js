const path = require('path');
const fs = require('fs');

// função que vai ser chamada na rota
exports.uploadImagem = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ erro: 'Nenhum arquivo enviado' });
  }

  const pastaImagens = path.join(__dirname, '../../frontend/img');
  const novoArquivo = req.file.filename;

  // Recebe o nome do arquivo antigo pelo body (ex: "livro1.jpg")
  const arquivoAntigo = req.body.arquivoAntigo;

  if (arquivoAntigo) {
    const caminhoAntigo = path.join(pastaImagens, arquivoAntigo);

    if (fs.existsSync(caminhoAntigo)) {
      // Renomeia a imagem antiga em vez de apagar
      const novoNomeAntigo = `${arquivoAntigo}-old-${Date.now()}.jpg`;
      fs.renameSync(caminhoAntigo, path.join(pastaImagens, novoNomeAntigo));
      console.log(`Imagem antiga renomeada para ${novoNomeAntigo}`);
    }
  }

  return res.status(200).json({
    mensagem: 'Upload realizado com sucesso!',
    arquivo: novoArquivo,
    caminho: `/img/${novoArquivo}`
  });
};
