
// Configuração da API, IP e porta.
const API_BASE_URL = 'http://localhost:3001';
let currentGeneroId = null;
let operacao = null;

// Elementos do DOM
const form = document.getElementById('generoForm');
const searchId = document.getElementById('searchId');
const btnBuscar = document.getElementById('btnBuscar');
const btnIncluir = document.getElementById('btnIncluir');
const btnAlterar = document.getElementById('btnAlterar');
const btnExcluir = document.getElementById('btnExcluir');
const btnCancelar = document.getElementById('btnCancelar');
const btnSalvar = document.getElementById('btnSalvar');
const generosTableBody = document.getElementById('generosTableBody');
const messageContainer = document.getElementById('messageContainer');

// Carregar lista de gêneros ao inicializar
document.addEventListener('DOMContentLoaded', () => {
    carregarGeneros();
});

// Event Listeners
btnBuscar.addEventListener('click', buscarGenero);
btnIncluir.addEventListener('click', incluirGenero);
btnAlterar.addEventListener('click', alterarGenero);
btnExcluir.addEventListener('click', excluirGenero);
btnCancelar.addEventListener('click', cancelarOperacao);
btnSalvar.addEventListener('click', salvarOperacao);

mostrarBotoes(true, false, false, false, false, false);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
bloquearCampos(false);//libera pk e bloqueia os demais campos

// Função para mostrar mensagens
function mostrarMensagem(texto, tipo = 'info') {
    messageContainer.innerHTML = `<div class="message ${tipo}">${texto}</div>`;
    setTimeout(() => {
        messageContainer.innerHTML = '';
    }, 3000);
}

function bloquearCampos(bloquearPrimeiro) {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach((input, index) => {
        if (index === 0) {
            // Primeiro elemento - bloqueia se bloquearPrimeiro for true, libera se for false
            input.disabled = bloquearPrimeiro;
        } else {
            // Demais elementos - faz o oposto do primeiro
            input.disabled = !bloquearPrimeiro;
        }
    });
}

// Função para limpar formulário
function limparFormulario() {
    form.reset();
}


function mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar) {
    btnBuscar.style.display = btBuscar ? 'inline-block' : 'none';
    btnIncluir.style.display = btIncluir ? 'inline-block' : 'none';
    btnAlterar.style.display = btAlterar ? 'inline-block' : 'none';
    btnExcluir.style.display = btExcluir ? 'inline-block' : 'none';
    btnSalvar.style.display = btSalvar ? 'inline-block' : 'none';
    btnCancelar.style.display = btCancelar ? 'inline-block' : 'none';
}

// Função para formatar data para exibição
function formatarData(dataString) {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

// Função para converter data para formato ISO
function converterDataParaISO(dataString) {
    if (!dataString) return null;
    return new Date(dataString).toISOString();
}

function slugify(nome) {
    return nome
    .toLowerCase()
    .trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/\s+/g, "-") // troca espaços por hífen
    .replace(/[^a-z0-9-]/g, ""); // remove caracteres especiais
}

// Função para buscar genero por ID
async function buscarGenero() {
    const id = searchId.value.trim();
    if (!id) {
        mostrarMensagem('Digite um ID para buscar', 'warning');
        return;
    }
    bloquearCampos(false);
    //focus no campo searchId
    searchId.focus();
    try {
        const response = await fetch(`${API_BASE_URL}/genero/${id}`);
        console.log("searchId:", searchId, "value:", searchId?.value);

        if (response.ok) {
            const genero = await response.json();
            preencherFormulario(genero);

            mostrarBotoes(true, false, true, true, false, false);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
            mostrarMensagem('Gênero encontrado!', 'success');

        } else if (response.status === 404) {
            limparFormulario();
            resetarTabelaItensCarrinho(); 
            searchId.value = id;
            mostrarBotoes(true, true, false, false, false, false); //mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
            mostrarMensagem('Gênero não encontrado. Você pode incluir um novo gênero.', 'info');
            bloquearCampos(false);//bloqueia a pk e libera os demais campos
            //enviar o foco para o campo de nome
        } else {
            throw new Error('Erro ao buscar gênero');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao buscar gênero', 'error');
    }
}


// Função para carregar itens
async function carregarItensDoCarrinho(carrinhoId) {
    try {
        // debugger;
        const responseItens = await fetch(`${API_BASE_URL}/carrinho_livros/${carrinhoId}`);

        if (responseItens.ok) {
            const itensDoCarrinho = await responseItens.json();
            renderizerTabelaItensCarrinho(itensDoCarrinho || []);
        } else if (responseItens.status === 404) {
            // Silencia completamente o 404 - sem console.log
            const itensTableBody = document.getElementById('itensTableBody');
            itensTableBody.innerHTML = '';
        }
        // Ignora outros status silenciosamente
    } catch (error) {
        // Ignora erros de rede silenciosamente para itens
    }
}


// --- Alterado para mostrar imagem ao preencher formulário ---
function preencherFormulario(genero) {

    console.log(JSON.stringify(genero));

    currentGeneroId = genero.id_genero;
    searchId.value = genero.id_genero;
    document.getElementById('nome_genero').value = genero.nome_genero || '';
    document.getElementById('descricao_genero').value = genero.descricao_genero || '';

    // Mostra imagem já salva
    if (genero.imagem_genero) {
        previewImagem.src = genero.imagem_genero;
        previewImagem.style.display = "block";
    } else {
        previewImagem.style.display = "none";
    }
}

// Função para resetar a tabela de itens do carrinho
function resetarTabelaItensCarrinho() {
    const itensTableBody = document.getElementById('itensTableBody');
    itensTableBody.innerHTML = ''; // Limpa todas as linhas da tabela
}


// Função para incluir genero
async function incluirGenero() {

    mostrarMensagem('Digite os dados!', 'success');
    currentGeneroId = searchId.value;
    // console.log('Incluir novo genero - currentGeneroId: ' + currentGeneroId);
    limparFormulario();
    resetarTabelaItensCarrinho(); 
    searchId.value = currentGeneroId;
    bloquearCampos(true);

    mostrarBotoes(false, false, false, false, true, true); // mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    document.getElementById('nome_genero').focus();
    operacao = 'incluir';
    // console.log('fim nova genero - currentGeneroId: ' + currentGeneroId);
}

// Função para alterar genero
async function alterarGenero() {
    mostrarMensagem('Digite os dados!', 'success');
    bloquearCampos(true);
    mostrarBotoes(false, false, false, false, true, true);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    document.getElementById('nome_genero').focus();
    operacao = 'alterar';
}

// Função para excluir genero
async function excluirGenero() {
    mostrarMensagem('Excluindo genero...', 'info');
    currentGeneroId = searchId.value;
    //bloquear searchId
    searchId.disabled = true;
    bloquearCampos(false); // libera os demais campos
    mostrarBotoes(false, false, false, false, true, true);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)           
    operacao = 'excluir';
}

async function salvarOperacao() {
    console.log('Operação:', operacao, ', ID:', currentGeneroId);

    const formData = new FormData(form);
    const genero = {
        id_genero: searchId.value,
        nome_genero: formData.get('nome_genero'),
        descricao_genero: formData.get('descricao_genero'),

    };
    let response = null;
    try {
        if (operacao === 'incluir') {
            response = await fetch(`${API_BASE_URL}/genero`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(genero)
            });
            const formImage = new FormData();
            const slug = slugify(genero.nome_genero);

        
            const novo_arquivo = new File([imagem_genero.files[0]], slug, { type: imagem_genero.files[0].type });
            formImage.append("imagem", novo_arquivo)
            console.log(formImage)


            await fetch(`${API_BASE_URL}/utils/upload-imagem`, {
                method: 'POST',
                body: formImage 
            })


            
        } else if (operacao === 'alterar') {
            response = await fetch(`${API_BASE_URL}/genero/${currentGeneroId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(genero)
            });
            const formImage = new FormData();
            const slug = slugify(genero.nome_genero);
            
            const novo_arquivo = new File([imagem_genero.files[0]], slug, { type: imagem_genero.files[0].type });
            formImage.append("imagem", novo_arquivo)
            console.log(formImage)


            await fetch(`${API_BASE_URL}/utils/upload-imagem`, {
                method: 'POST',
                body: formImage 
            })
        } else if (operacao === 'excluir') {
            // console.log('Excluindo genero com ID:', currentGeneroId);
            response = await fetch(`${API_BASE_URL}/genero/${currentGeneroId}`, {
                method: 'DELETE'
            });
            console.log('Genero excluído' + response.status);
        }
        if (response.ok && (operacao === 'incluir' || operacao === 'alterar')) {
            const novoGenero = await response.json();
            mostrarMensagem('Operação ' + operacao + ' realizada com sucesso!', 'success');
            limparFormulario();
            resetarTabelaItensCarrinho(); 
            carregarGeneros();

        } else if (operacao !== 'excluir') {
            const error = await response.json();
            mostrarMensagem(error.error || 'Erro ao incluir gênero', 'error');
        } else {
            mostrarMensagem('Gênero excluído com sucesso!', 'success');
            resetarTabelaItensCarrinho(); 
            limparFormulario();
            carregarGeneros();
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao incluir ou alterar o gênero', 'error');
    }

    mostrarBotoes(true, false, false, false, false, false);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    bloquearCampos(false);//libera pk e bloqueia os demais campos
    document.getElementById('searchId').focus();
}

// Função para cancelar operação
function cancelarOperacao() {
    limparFormulario();
    resetarTabelaItensCarrinho(); 
    mostrarBotoes(true, false, false, false, false, false);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    bloquearCampos(false);//libera pk e bloqueia os demais campos
    document.getElementById('searchId').focus();
    mostrarMensagem('Operação cancelada', 'info');
}

// Função para carregar lista de generos
async function carregarGeneros() {
    try {
        const rota = `${API_BASE_URL}/genero`;
       // console.log("a rota " + rota);

       
        const response = await fetch(rota);
     //   console.log(JSON.stringify(response));


        //    debugger
        if (response.ok) {
            const generos = await response.json();
            renderizarTabelaGeneros(generos);
        } else {
            throw new Error('Erro ao carregar gêneros');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar lista de gêneros', 'error');
    }
}

// --- Alterado para renderizar imagem na tabela ---
function renderizarTabelaGeneros(generos) {
    generosTableBody.innerHTML = '';

    generos.forEach(genero => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <button class="btn-id" onclick="selecionarGenero(${genero.id_genero})">
                    ${genero.id_genero}
                </button>
            </td>
            <td>${genero.nome_genero}</td>
            <td>${genero.descricao_genero}</td>
            <td>
                ${genero.imagem_genero ? `<img src="../img/${genero.imagem_genero}" alt="${nome_genero}" style="max-width:60px;max-height:60px;">` : ''}
            </td>
            <td>${genero.slug_genero}</td>
        `;
        generosTableBody.appendChild(row);
    });
}

// Função para selecionar genero da tabela
async function selecionarGenero(id) {
    searchId.value = id;
    await buscarGenero();
}

// --- Preview da imagem escolhida ---
const inputImagem = document.getElementById('imagem_genero');
const previewImagem = document.getElementById('preview_imagem');

inputImagem.addEventListener('change', () => {
    const file = inputImagem.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            previewImagem.src = e.target.result;
            previewImagem.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        previewImagem.style.display = "none";
    }
});

