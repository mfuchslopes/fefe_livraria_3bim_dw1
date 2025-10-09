function handleUserAction(action) {
  if (action === "gerenciar-conta") {
    alert("Redirecionando para a página de Gerenciar Conta...");
    // window.location.href = "/gerenciar-conta";
  } else if (action === "sair") {
    alert("Desconectando...");
    // logout();
  }
}

// A função 'logout' original
function logout() {
  alert("Desconectando...");
  // window.location.href = "/login";
}

const API_BASE_URL = 'http://localhost:3001';
let ehProfessor = false;



//essa função só existe para teste inicial
function nomeUsuario() {
  const combobox = document.getElementById("oUsuario");
  const primeiraOpcao = combobox.options[0];
  primeiraOpcao.text = "Berola da Silva";

 //  usuarioAutorizado();


}

// Chame a função quando a página carregar
window.onload = nomeUsuario;

async function usuarioAutorizado() {
  
  const rota = API_BASE_URL + '/login/verificaSeUsuarioEstaLogado';
  alert('Rota: ' + rota);
  
  const res = await fetch(rota, { credentials: 'include' });
  alert(JSON.stringify(data));




  const data = await res.json();
  if (data.status === 'ok') {
    document.getElementById('boasVindas').innerText =
      `${data.nome} - ${data.mnemonicoProfessor ? `Professor: ${data.mnemonicoProfessor}` : ''}`;
    if (data.mnemonicoProfessor) ehProfessor = true;
  } else {
    alert("Você precisa fazer login.");
    window.location.href = "./login/login.html";
  }
}

async function logout2() {
  await fetch('http://localhost:3005/logout', {
    method: 'POST',
    credentials: 'include'
  });
  window.location.href = "http://localhost:3005/inicio";
}

// usuarioAutorizado();
document.addEventListener('DOMContentLoaded', () => {
  carregarGeneros();
});

function carregarGeneros() {
  fetch(`${API_BASE_URL}/genero/`)
    .then(res => res.json())
    .then(generos => {
      const container = document.getElementById('generos-container');
      container.innerHTML = '<h2>Escolha um gênero:</h2><div class="generos-list"></div>';
      const lista = container.querySelector('.generos-list');
      generos.forEach(genero => {
        const btn = document.createElement('button');
        btn.className = 'genero-btn';
        btn.textContent = genero.nome_genero;
        btn.onclick = () => carregarLivrosPorGenero(genero.id_genero, genero.nome_genero);
        lista.appendChild(btn);
      });
    });
}

function carregarLivrosPorGenero(idGenero, nomeGenero) {
  fetch(`${API_BASE_URL}/livro_genero/${idGenero}`)
    .then(res => res.json())
    .then(async relacionamentos => {
      const container = document.getElementById('livros-container');
      container.innerHTML = `<h2 class="titulo-genero">${nomeGenero}</h2><div class="livros-list"></div>`;
      const lista = container.querySelector('.livros-list');
      if (relacionamentos.length === 0) {
        lista.innerHTML = '<p class="sem-livros">Nenhum livro encontrado para este gênero.</p>';
        return;
      }
      // Buscar os livros completos
      const livros = await Promise.all(
        relacionamentos.map(rel =>
          fetch(`${API_BASE_URL}/livro/${rel.id_livro}`).then(res => res.json())
        )
      );
      livros.forEach(livro => {
        const card = document.createElement('div');
        card.className = 'livro-card';
        card.innerHTML = `
          <img src="img/${livro.imagem_livro}" alt="${livro.nome_livro}" class="livro-img">
          <div class="livro-info">
            <h3>${livro.nome_livro}</h3>
            <p class="livro-preco">R$${livro.preco}</p>
            <p>${livro.descricao_livro || ''}</p>
            <button class="btn-carrinho">Adicionar ao Carrinho</button>
          </div>
        `;
        lista.appendChild(card);
      });
    });
}

function handleUserAction(value) {
  if (value === 'gerenciar-conta') {
    window.location.href = 'pessoa/pessoa.html';
  } else if (value === 'sair') {
    window.location.href = 'login/login.html';
  }
}

const menuLinks = document.querySelectorAll('.menu-link');

menuLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // evita que o link navegue
    
    const submenu = link.nextElementSibling; // pega o submenu correspondente

    if (!submenu) return;

    // Fecha todos os outros submenus
    document.querySelectorAll('.nav__submenu').forEach(sm => {
      if (sm !== submenu) sm.classList.remove('show');
    });

    // Alterna o submenu atual
    submenu.classList.toggle('show');
  });
});

// Opcional: clicar fora do menu fecha todos os submenus
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav__menu-item')) {
    document.querySelectorAll('.nav__submenu').forEach(sm => sm.classList.remove('show'));
  }
});
