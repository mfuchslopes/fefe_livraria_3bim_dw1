const API_BASE_URL = 'http://localhost:3001';


const disponiveisList = document.getElementById("disponiveis-list");
const autorList = document.getElementById("autor-list");
const autorContainer = document.getElementById("autor");
const disponiveisContainer = document.getElementById("disponiveis");

let autorId = null;
// Carregar lista de autores ao inicializar
document.addEventListener('DOMContentLoaded', () => {
    selectAutores();
    carregarLivrosAutor(autorId);
   // carregarAutores();
   carregarLivros(); //todas as livros
});


function salvarLivrosDoAutor() {
    alert('Salvando livros do autor...');
    if (!autorId) {
        mostrarMensagem('Selecione umo autor antes de salvar', 'error');
        return;
    }

    const livrosIds = Array.from(autorList.children).map(item => item.getAttribute('data-id'));

    fetch(`${API_BASE_URL}/livro_autor/${autorId}`, {
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

async function selectAutores() {
    try {
        const response = await fetch(`${API_BASE_URL}/autor`);
        if (response.ok) {
            const autores = await response.json();
            const select = document.getElementById('autorSelect');
            select.innerHTML = '<option value="">Selecione umo autor</option>'; // Limpa e adiciona opção padrão

            autores.forEach(autor => {
                const option = document.createElement('option');
                option.value = autor.id_autor;
                option.textContent = autor.nome_autor;
                select.appendChild(option);
            });

            // Adiciona listener para carregar livros do autor selecionada
            select.addEventListener('change', async (event) => {
                autorId = event.target.value;
                if (autorId) {
                    await carregarLivrosAutor(autorId);
                } else {
                    autorList.innerHTML = ''; // Limpa a lista se nenhumo autor for selecionada
                }
            });
        } else {
            throw new Error('Erro ao carregar autores');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar lista de autores', 'error');
    }
}

// Função para carregar livros do autor selecionada
async function carregarLivrosAutor(autorId) {
    try {
        let rotaLivro_autor = API_BASE_URL + '/livro_autor/' + autorId;
        const response = await fetch(rotaLivro_autor);
        if (response.ok) {
            const livros = await response.json();
            autorList.innerHTML = ''; // Limpa a lista antes de adicionar novos itens

            livros.forEach(livro => {
                const div = document.createElement('div');
                div.className = 'livro';
                div.setAttribute('draggable', 'false'); // Não permite arrastar livros já no autor
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
                autorList.appendChild(div);
            });
        } else {
            throw new Error('Erro ao carregar livros do autor');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar livros do autor', 'error');
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
// Função para carregar lista de autor
async function carregarAutores() {
    try {
        const response = await fetch(`${API_BASE_URL}/autor`);
        //    debugger
        if (response.ok) {
            const autores = await response.json();
            autorList.innerHTML = ''; // Limpa a lista antes de adicionar novos itens

            autores.forEach(autor => {
                const div = document.createElement('div');
                div.className = 'autor';
                div.setAttribute('draggable', 'true');
                div.setAttribute('data-id', autor.id_autor);
                div.textContent = autor.nome_autor;

                // Adiciona event listeners para drag and drop
                addDragListeners(div);

                disponiveisList.appendChild(div);
            });



        } else {
            throw new Error('Erro ao carregar autores');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar lista de autores', 'error');
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
const containers = [autorContainer, disponiveisContainer];

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
            if (container.id === "autor") {
                // Verifica se a questão já existe no autor
                const existingQuestion = Array.from(autorList.children).find(
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
                    autorList.appendChild(clone);
                }
            }
        }
    });
});

// Impede que o evento de drop seja propagado para elementos pais
document.addEventListener("dragover", e => e.preventDefault());
document.addEventListener("drop", e => e.preventDefault());