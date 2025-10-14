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
      container.innerHTML = '<h2>Escolha um gênero:</h2>';
      generos.forEach(genero => {
        // Criação da seção do gênero
        const generoSection = document.createElement('section');
        generoSection.className = 'genero';
        generoSection.dataset.id = genero.id_genero;
        generoSection.innerHTML = `
          <div class="genero-top">
            <img src="img/${genero.imagem_genero || 'default_genre.png'}" alt="${genero.nome_genero}" class="genero-img">
            <div class="genero-header">
              <h2>${genero.nome_genero}</h2>
              <p>${genero.descricao_genero || ''}</p>
            </div>
          </div>
          <div class="livros-container"></div>
        `;
        // Evento de clique para exibir os livros
        generoSection.addEventListener('click', () =>
          carregarLivrosPorGenero(genero.id_genero, generoSection)
        );
        container.appendChild(generoSection);
      });
    });
}

async function carregarLivrosPorGenero(idGenero, generoSection, options = {}) {
  const livrosContainer = generoSection.querySelector('.livros-container');
  const animationDuration = options.duration ?? 500; // ms
  const headerSelector = options.headerSelector ?? 'header';
  const header = document.querySelector(headerSelector);
  const offset = options.offset ?? (header ? header.getBoundingClientRect().height : 0);

  // === Função para abrir com animação ===
  function abrirContainer(container) {
    return new Promise(resolve => {
      container.classList.add('abrindo');
      container.style.overflow = 'hidden';
      container.style.height = '0px';
      container.style.opacity = '0';
      container.getBoundingClientRect();

      requestAnimationFrame(() => {
        container.style.transition = `height ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${animationDuration}ms ease`;
        container.style.height = container.scrollHeight + 'px';
        container.style.opacity = '1';
      });

      function onEnd(e) {
        if (e.propertyName === 'height') {
          container.removeEventListener('transitionend', onEnd);
          container.style.transition = '';
          container.style.height = '';
          container.style.overflow = '';
          container.classList.remove('abrindo');
          container.classList.add('aberto');
          resolve();
        }
      }

      container.addEventListener('transitionend', onEnd);
      setTimeout(() => {
        container.removeEventListener('transitionend', onEnd);
        container.style.transition = '';
        container.style.height = '';
        container.style.overflow = '';
        container.classList.remove('abrindo');
        container.classList.add('aberto');
        resolve();
      }, animationDuration + 100);
    });
  }

  // === Função para fechar com animação ===
  function fecharContainer(container) {
    return new Promise(resolve => {
      if (!container.classList.contains('aberto')) return resolve();

      container.classList.remove('aberto');
      container.classList.add('fechando');
      container.style.overflow = 'hidden';
      container.style.height = container.scrollHeight + 'px';
      container.style.opacity = '1';
      container.getBoundingClientRect();

      requestAnimationFrame(() => {
        container.style.transition = `height ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${animationDuration}ms ease`;
        container.style.height = '0px';
        container.style.opacity = '0';
      });

      function onEnd(e) {
        if (e.propertyName === 'height') {
          container.removeEventListener('transitionend', onEnd);
          container.innerHTML = '';
          container.style.transition = '';
          container.style.height = '';
          container.style.opacity = '';
          container.style.overflow = '';
          container.classList.remove('fechando');
          resolve();
        }
      }

      container.addEventListener('transitionend', onEnd);
      setTimeout(() => {
        container.innerHTML = '';
        container.removeEventListener('transitionend', onEnd);
        container.style.transition = '';
        container.style.height = '';
        container.style.opacity = '';
        container.style.overflow = '';
        container.classList.remove('fechando');
        resolve();
      }, animationDuration + 100);
    });
  }

  try {
    // Fecha outros abertos antes
    const outros = Array.from(document.querySelectorAll('.livros-container.aberto, .livros-container.abrindo'))
      .filter(div => div !== livrosContainer);
    await Promise.all(outros.map(div => fecharContainer(div)));

    // Se já está aberto, fecha e sai
    if (livrosContainer.classList.contains('aberto')) {
      await fecharContainer(livrosContainer);
      return;
    }

    // Busca os relacionamentos
    let relacionamentos;
    try {
      const res = await fetch(`${API_BASE_URL}/livro_genero/${idGenero}`);
      relacionamentos = await res.json();
    } catch (err) {
      console.error('Erro ao buscar livros:', err);
      livrosContainer.innerHTML = '<p class="sem-livros">Erro ao buscar livros. Tente novamente.</p>';
      await abrirContainer(livrosContainer);
      return;
    }

    // Monta os livros
    livrosContainer.innerHTML = '';
    if (!Array.isArray(relacionamentos) || relacionamentos.length === 0) {
      livrosContainer.innerHTML = '<p class="sem-livros">Nenhum livro encontrado para este gênero.</p>';
    } else {
      const livros = await Promise.all(
        relacionamentos.map(rel =>
          fetch(`${API_BASE_URL}/livro/${rel.id_livro}`).then(r => r.ok ? r.json() : null)
        )
      );

      livros.forEach(livro => {
        if (!livro) return;
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
        livrosContainer.appendChild(card);
      });
    }

    // Abre e rola suavemente até o gênero
    await abrirContainer(livrosContainer);

    setTimeout(() => {
      const rect = generoSection.getBoundingClientRect();
      const targetY = window.scrollY + rect.top - offset;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }, animationDuration / 2);

  } catch (err) {
    console.error('Erro inesperado:', err);
    livrosContainer.innerHTML = '<p class="sem-livros">Erro inesperado.</p>';
  }
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
