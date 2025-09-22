
// Configuração da API, IP e porta.
const API_BASE_URL = 'http://localhost:3001';
let currentAutorId = null;
let operacao = null;

// Elementos do DOM
const form = document.getElementById('autorForm');
const searchId = document.getElementById('searchId');
const btnBuscar = document.getElementById('btnBuscar');
const btnIncluir = document.getElementById('btnIncluir');
const btnAlterar = document.getElementById('btnAlterar');
const btnExcluir = document.getElementById('btnExcluir');
const btnCancelar = document.getElementById('btnCancelar');
const btnSalvar = document.getElementById('btnSalvar');
const autorsTableBody = document.getElementById('autorsTableBody');
const messageContainer = document.getElementById('messageContainer');

// Carregar lista de autors ao inicializar
document.addEventListener('DOMContentLoaded', () => {
    carregarAutors();
});

// Event Listeners
btnBuscar.addEventListener('click', buscarAutor);
btnIncluir.addEventListener('click', incluirAutor);
btnAlterar.addEventListener('click', alterarAutor);
btnExcluir.addEventListener('click', excluirAutor);
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

// Função para buscar autor por ID
async function buscarAutor() {
    const id = searchId.value.trim();
    if (!id) {
        mostrarMensagem('Digite um ID para buscar', 'warning');
        return;
    }
    bloquearCampos(false);
    //focus no campo searchId
    searchId.focus();
    try {
        const response = await fetch(`${API_BASE_URL}/autor/${id}`);
        console.log(JSON.stringify(response));

        if (response.ok) {
            const autor = await response.json();
            preencherFormulario(autor);

            mostrarBotoes(true, false, true, true, false, false);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
            mostrarMensagem('Autor encontrado!', 'success');

        } else if (response.status === 404) {
            limparFormulario();
            searchId.value = id;
            mostrarBotoes(true, true, false, false, false, false); //mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
            mostrarMensagem('Autor não encontrado. Você pode incluir um novo autor.', 'info');
            bloquearCampos(false);//bloqueia a pk e libera os demais campos
            //enviar o foco para o campo de nome
        } else {
            throw new Error('Erro ao buscar autor');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao buscar autor', 'error');
    }
}

// Função para preencher formulário com dados da autor
function preencherFormulario(autor) {
    console.log(JSON.stringify(autor));


    currentAutorId = autor.id_autor;
    searchId.value = autor.id_autor;
    document.getElementById('nome_autor').value = autor.nome_autor || '';

}


// Função para incluir autor
async function incluirAutor() {

    mostrarMensagem('Digite os dados!', 'success');
    currentAutorId = searchId.value;
    // console.log('Incluir nova autor - currentAutorId: ' + currentAutorId);
    limparFormulario();
    searchId.value = currentAutorId;
    bloquearCampos(true);

    mostrarBotoes(false, false, false, false, true, true); // mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    document.getElementById('nome_autor').focus();
    operacao = 'incluir';
    // console.log('fim nova autor - currentAutorId: ' + currentAutorId);
}

// Função para alterar autor
async function alterarAutor() {
    mostrarMensagem('Digite os dados!', 'success');
    bloquearCampos(true);
    mostrarBotoes(false, false, false, false, true, true);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    document.getElementById('nome_autor').focus();
    operacao = 'alterar';
}

// Função para excluir autor
async function excluirAutor() {
    mostrarMensagem('Excluindo autor...', 'info');
    currentAutorId = searchId.value;
    //bloquear searchId
    searchId.disabled = true;
    bloquearCampos(false); // libera os demais campos
    mostrarBotoes(false, false, false, false, true, true);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)           
    operacao = 'excluir';
}

async function salvarOperacao() {
    console.log('Operação:', operacao + ' - currentAutorId: ' + currentAutorId + ' - searchId: ' + searchId.value);

    const formData = new FormData(form);
    const autor = {
        id_autor: searchId.value,
        nome_autor: formData.get('nome_autor'),

    };
    let response = null;
    try {
        if (operacao === 'incluir') {
            response = await fetch(`${API_BASE_URL}/autor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(autor)
            });
        } else if (operacao === 'alterar') {
            response = await fetch(`${API_BASE_URL}/autor/${currentAutorId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(autor)
            });
        } else if (operacao === 'excluir') {
            // console.log('Excluindo autor com ID:', currentAutorId);
            response = await fetch(`${API_BASE_URL}/autor/${currentAutorId}`, {
                method: 'DELETE'
            });
            console.log('Autor excluído' + response.status);
        }
        if (response.ok && (operacao === 'incluir' || operacao === 'alterar')) {
            const novaAutor = await response.json();
            mostrarMensagem('Operação ' + operacao + ' realizada com sucesso!', 'success');
            limparFormulario();
            carregarAutors();

        } else if (operacao !== 'excluir') {
            const error = await response.json();
            mostrarMensagem(error.error || 'Erro ao incluir autor', 'error');
        } else {
            mostrarMensagem('Autor excluído com sucesso!', 'success');
            limparFormulario();
            carregarAutors();
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao incluir ou alterar a autor', 'error');
    }

    mostrarBotoes(true, false, false, false, false, false);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    bloquearCampos(false);//libera pk e bloqueia os demais campos
    document.getElementById('searchId').focus();
}

// Função para cancelar operação
function cancelarOperacao() {
    limparFormulario();
    mostrarBotoes(true, false, false, false, false, false);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    bloquearCampos(false);//libera pk e bloqueia os demais campos
    document.getElementById('searchId').focus();
    mostrarMensagem('Operação cancelada', 'info');
}

// Função para carregar lista de autors
async function carregarAutors() {
    try {
        const rota = `${API_BASE_URL}/autor`;
       // console.log("a rota " + rota);

       
        const response = await fetch(rota);
     //   console.log(JSON.stringify(response));


        //    debugger
        if (response.ok) {
            const autors = await response.json();
            renderizarTabelaAutors(autors);
        } else {
            throw new Error('Erro ao carregar autors');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar lista de autors', 'error');
    }
}

// Função para renderizar tabela de autors
function renderizarTabelaAutors(autors) {
    autorsTableBody.innerHTML = '';

    autors.forEach(autor => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>
                        <button class="btn-id" onclick="selecionarAutor(${autor.id_autor})">
                            ${autor.id_autor}
                        </button>
                    </td>
                    <td>${autor.nome_autor}</td>                  
                                 
                `;
        autorsTableBody.appendChild(row);
    });
}

// Função para selecionar autor da tabela
async function selecionarAutor(id) {
    searchId.value = id;
    await buscarAutor();
}
