const API_BASE_URL = 'http://localhost:3001';


const disponiveisList = document.getElementById("disponiveis-list");
const generoList = document.getElementById("genero-list");
const generoContainer = document.getElementById("genero");
const disponiveisContainer = document.getElementById("disponiveis");

let generoId = null;
// Carregar lista de generos ao inicializar
document.addEventListener('DOMContentLoaded', () => {
    selectGeneros();
    carregarLivrosGenero(generoId);
   // carregarGeneros();
   carregarLivros(); //todas as livros
});


function salvarLivrosDoGenero() {
    alert('Salvando livros do genero...');
    if (!generoId) {
        mostrarMensagem('Selecione umo genero antes de salvar', 'error');
        return;
    }

    const livrosIds = Array.from(generoList.children).map(item => item.getAttribute('data-id'));

    fetch(`${API_BASE_URL}/livro_genero/${generoId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ livros: livrosIds })
    })
    .then(response => {
        if (response.ok) {
            mostrarMensagem('Livros salvas com sucesso!', 'success');
        } else {
            throw new Error('Erro ao salvar livros');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao salvar livros', 'error');
    });
}

async function selectGeneros() {
    try {
        const response = await fetch(`${API_BASE_URL}/genero`);
        if (response.ok) {
            const generos = await response.json();
            const select = document.getElementById('generoSelect');
            select.innerHTML = '<option value="">Selecione umo genero</option>'; // Limpa e adiciona opção padrão

            generos.forEach(genero => {
                const option = document.createElement('option');
                option.value = genero.id_genero;
                option.textContent = genero.nome_genero;
                select.appendChild(option);
            });

            // Adiciona listener para carregar livros do genero selecionada
            select.addEventListener('change', async (event) => {
                generoId = event.target.value;
                if (generoId) {
                    await carregarLivrosGenero(generoId);
                } else {
                    generoList.innerHTML = ''; // Limpa a lista se nenhumo genero for selecionada
                }
            });
        } else {
            throw new Error('Erro ao carregar generos');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar lista de generos', 'error');
    }
}

// Função para carregar livros do genero selecionada
async function carregarLivrosGenero(generoId) {
    try {
        let rotaLivro_genero = API_BASE_URL + '/livro_genero/' + generoId;
        const response = await fetch(rotaLivro_genero);
        if (response.ok) {
            const livros = await response.json();
            generoList.innerHTML = ''; // Limpa a lista antes de adicionar novos itens

            livros.forEach(livro => {
                const div = document.createElement('div');
                div.className = 'livro';
                div.setAttribute('draggable', 'false'); // Não permite arrastar livros já no genero
                div.setAttribute('data-id', livro.id_livro);
                div.textContent = livro.nome_livro;

                // Adiciona botão de excluir
                const btn = document.createElement('button');
                btn.textContent = 'X';
                btn.addEventListener('click', () => {
                    div.remove();
                    // Reativa o item original na lista de disponíveis
                    const originalItem = document.querySelector(`#disponiveis-list .livro[data-id="${livro.id_livro}"]`);
                    if (originalItem) {
                        originalItem.style.display = 'flex';
                    }
                });

                div.appendChild(btn);
                generoList.appendChild(div);
            });
        } else {
            throw new Error('Erro ao carregar livros do genero');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar livros do genero', 'error');
    }
}

async function carregarLivros(){
    try {
        const response = await fetch(`${API_BASE_URL}/livro`);
        if (response.ok) {
            const livros = await response.json();
            disponiveisList.innerHTML = ''; // Limpa a lista antes de adicionar novos itens
            
          livros.forEach(livro => {
                const div = document.createElement('div');
                div.className = 'livro';
                div.setAttribute('draggable', 'true');
                div.setAttribute('data-id', livro.id_livro);
                div.textContent = livro.nome_livro;

                // Adiciona event listeners para drag and drop
                addDragListeners(div);

                disponiveisList.appendChild(div);
            }); 
        } else {
            throw new Error('Erro ao carregar livros');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar lista de livros', 'error');
    }
}   
                

// Função para mostrar mensagens ao usuário
function mostrarMensagem(mensagem, tipo) {
    const mensagemDiv = document.getElementById('mensagem');
    mensagemDiv.textContent = mensagem;
    mensagemDiv.className = tipo; // 'success' ou 'error'
    setTimeout(() => {
        mensagemDiv.textContent = '';
        mensagemDiv.className = '';
    }, 3000);
}
// Função para carregar lista de genero
async function carregarGeneros() {
    try {
        const response = await fetch(`${API_BASE_URL}/genero`);
        //    debugger
        if (response.ok) {
            const generos = await response.json();
            generoList.innerHTML = ''; // Limpa a lista antes de adicionar novos itens

            generos.forEach(genero => {
                const div = document.createElement('div');
                div.className = 'genero';
                div.setAttribute('draggable', 'true');
                div.setAttribute('data-id', genero.id_genero);
                div.textContent = genero.nome_genero;

                // Adiciona event listeners para drag and drop
                addDragListeners(div);

                disponiveisList.appendChild(div);
            });



        } else {
            throw new Error('Erro ao carregar generos');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar lista de generos', 'error');
    }
}

let draggedItem = null;

// Adiciona event listeners para todos os itens
function addDragListeners(item) {
    item.addEventListener("dragstart", e => {
        draggedItem = item;
        e.dataTransfer.setData("text/plain", item.getAttribute("data-id"));
        item.classList.add("dragging");
        setTimeout(() => item.style.display = "none", 0);
    });

    item.addEventListener("dragend", e => {
        item.classList.remove("dragging");
        setTimeout(() => {
            item.style.display = "flex";
            draggedItem = null;
        }, 0);
    });
}

// Inicializa os listeners para as livros iniciais
document.querySelectorAll(".livro").forEach(item => {
    addDragListeners(item);
});

// Configura os containers
const containers = [generoContainer, disponiveisContainer];

containers.forEach(container => {
    container.addEventListener("dragover", e => {
        e.preventDefault();
        container.classList.add("over");
    });

    container.addEventListener("dragleave", () => {
        container.classList.remove("over");
    });

    container.addEventListener("drop", e => {
        e.preventDefault();
        container.classList.remove("over");

        if (draggedItem) {
            // Se estiver soltando no container de avaliação
            if (container.id === "genero") {
                // Verifica se a questão já existe no genero
                const existingQuestion = Array.from(generoList.children).find(
                    item => item.getAttribute("data-id") === draggedItem.getAttribute("data-id")
                );

                if (!existingQuestion) {
                    const clone = draggedItem.cloneNode(true);
                    clone.setAttribute("draggable", "false");
                    clone.style.display = "flex";

                    // Adiciona botão de excluir
                    const btn = document.createElement("button");
                    btn.textContent = "X";
                    btn.addEventListener("click", () => {
                        clone.remove();
                        // Reativa o item original na lista de disponíveis
                        const originalItem = document.querySelector(`#disponiveis-list .livro[data-id="${draggedItem.getAttribute("data-id")}"]`);
                        if (originalItem) {
                            originalItem.style.display = "flex";
                        }
                    });

                    clone.appendChild(btn);
                    generoList.appendChild(clone);
                }
            }
        }
    });
});

// Impede que o evento de drop seja propagado para elementos pais
document.addEventListener("dragover", e => e.preventDefault());
document.addEventListener("drop", e => e.preventDefault());