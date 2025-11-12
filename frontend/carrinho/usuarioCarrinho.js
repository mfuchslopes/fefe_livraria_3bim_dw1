const API_BASE_URL = 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', carregarUsuarioCarrinhos);

function setCarrinhoCookie(carrinho) {
  document.cookie = `carrinhoUsuario=${encodeURIComponent(JSON.stringify(carrinho))};path=/;max-age=604800`;
}

function getCarrinhoCookie() {
  const match = document.cookie.match(/(?:^|; )carrinhoUsuario=([^;]*)/);
  return match ? JSON.parse(decodeURIComponent(match[1])) : [];
}

async function carregarUsuarioCarrinhos() {
  // Tenta buscar do backend, se logado
  let carrinhos = [];
  try {
    const res = await fetch(`${API_BASE_URL}/carrinho/meusCarrinhos`, { credentials: 'include' });
    if (res.ok) {
      carrinhos = await res.json();
    }
  } catch {}
  // Se não logado, usa cookie
  if (!carrinhos || !carrinhos.length) {
    carrinhos = getCarrinhoCookie();
  }
  const container = document.getElementById('usuario-carrinhos-container');
  container.innerHTML = '';
  if (!carrinhos.length) {
    container.innerHTML = '<p>Você não possui carrinhos.</p>';
    return;
  }
  carrinhos.forEach((carrinho, idx) => {
    const div = document.createElement('div');
    div.className = 'carrinho';
    div.innerHTML = `<strong>ID:</strong> ${carrinho.id_carrinho || idx+1} <button onclick="excluirUsuarioCarrinho(${idx})">Excluir</button>`;
    container.appendChild(div);
  });
}

async function adicionarUsuarioCarrinho() {
  // Se logado, salva no backend
  let logado = false;
  try {
    const resLogin = await fetch(`${API_BASE_URL}/login/verificaSeUsuarioEstaLogado`, { credentials: 'include' });
    const dataLogin = await resLogin.json();
    logado = dataLogin.status === 'ok';
  } catch {}
  if (logado) {
    await fetch(`${API_BASE_URL}/carrinho/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ /* dados do carrinho */ })
    });
  } else {
    // Visitante: salva no cookie
    let carrinhos = getCarrinhoCookie();
    const novoCarrinho = { id_carrinho: Date.now(), itens: [] };
    carrinhos.push(novoCarrinho);
    setCarrinhoCookie(carrinhos);
  }
  await carregarUsuarioCarrinhos();
}

async function excluirUsuarioCarrinho(idx) {
  // Se logado, exclui no backend
  let logado = false;
  try {
    const resLogin = await fetch(`${API_BASE_URL}/login/verificaSeUsuarioEstaLogado`, { credentials: 'include' });
    const dataLogin = await resLogin.json();
    logado = dataLogin.status === 'ok';
  } catch {}
  if (logado) {
    // Aqui você pode adaptar para excluir pelo id real do carrinho
    // await fetch(`${API_BASE_URL}/carrinho/${id}`, { method: 'DELETE', credentials: 'include' });
  } else {
    // Visitante: exclui do cookie
    let carrinhos = getCarrinhoCookie();
    carrinhos.splice(idx, 1);
    setCarrinhoCookie(carrinhos);
  }
  await carregarUsuarioCarrinhos();
}