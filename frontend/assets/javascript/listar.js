document.addEventListener("DOMContentLoaded", () => {
    const termoBusca = obterTermoBuscaDaUrl();

    if (termoBusca) {
        buscarReceitas(termoBusca);
    } else {
        carregarTodasReceitas();
    }
});

function obterTermoBuscaDaUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('busca');
}

function carregarTodasReceitas() {
    const containerLista = document.getElementById('lista-receitas');
    const user = sessionStorage.getItem('usuario');
    const isAdmin = user ? JSON.parse(user).funcao === "ADMIN" : false;

    fetch(`http://localhost:8081/site/listar`)
    .then(response => response.json())
    .then(receitas => renderizarReceitas(receitas, isAdmin))
    .catch(error => {
        console.error("Erro ao carregar a lista de receitas:", error);
        containerLista.innerHTML = '<p style="color: #2b1506; text-align: center;">Erro ao conectar com o servidor para buscar as receitas.</p>';
    });
}

function buscarReceitas(termo) {
    console.log(" Receita Buscada")
    const containerLista = document.getElementById('lista-receitas');
    const user = sessionStorage.getItem('usuario');
    const isAdmin = user ? JSON.parse(user).funcao === "ADMIN" : false;

    atualizarTituloBusca(termo);

    fetch(`http://localhost:8081/site/buscar_receita?nome=${encodeURIComponent(termo)}`)
    .then(response => response.json())
    .then(receitas => renderizarReceitas(receitas, isAdmin))
    .catch(error => {
        console.error("Erro ao buscar receitas:", error);
        containerLista.innerHTML = '<p style="color: #2b1506; text-align: center;">Erro ao conectar com o servidor para buscar as receitas.</p>';
    });
}

function atualizarTituloBusca(termo) {
    const titulo = document.querySelector('h2');
    if (titulo) {
        titulo.textContent = `Resultados para "${termo}"`;
    }
}

function renderizarReceitas(receitas, isAdmin) {
    const containerLista = document.getElementById('lista-receitas');

    if (!receitas || receitas.length === 0) {
        containerLista.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #555; font-size: 18px;">Nenhuma receita encontrada.</p>';
        return;
    }

    containerLista.innerHTML = '';

    receitas.forEach(async receita => {
        const card = await criarCardCompleto(receita, isAdmin);
        containerLista.appendChild(card);
    });
}

async function criarCardCompleto(receita, isAutenticado) {
    const card = document.createElement('div');
    card.className = 'recipe-card';

    const id = receita.id !== undefined ? receita.id : (receita._id || 0);
    let imagemUrl = await carregarImagemComFetch(id);

    let htmlCard = `
        <div class="card-image" style="background-image: url('${imagemUrl}');"></div>
        <div class="card-info">
            <h3>${receita.nome}</h3>
            <p><strong>Categoria:</strong> ${receita.categoria ? receita.categoria.replace('_', ' ') : 'Não informada'}<br>
            <strong>Tempo:</strong> ${receita.tempoPreparo} min | <strong>Rendimento:</strong> ${receita.rendimento}</p>
            <a href="detalhes.html?id=${id}" class="btn-link" style="display: block; margin-bottom: 10px;">Ver Receita Completa</a>
    `;

    if (isAutenticado) {
        htmlCard += `
            <div style="display: flex; gap: 15px; border-top: 1px solid #eee; padding-top: 15px; margin-top: 10px;">
                <button onclick="redirecionarParaEdicao(${id})" class="btn-edit" style="font-size: 14px;">Editar</button>
                <button onclick="excluirReceita(${id})" class="btn-delete" style="font-size: 14px;">✖ Excluir</button>
            </div>
        `;
    }

    htmlCard += `</div>`;
    card.innerHTML = htmlCard;

    return card;
}

function redirecionarParaEdicao(id) {
    window.location.href = `editar.html?id=${id}`;
}

function excluirReceita(id) {
    if (!confirm("Tem certeza que deseja excluir esta receita definitivamente?")) {
        return;
    }

    const json = {
        id: id
    }

    fetch(`http://localhost:8081/site/excluir_receita`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(json)
    })
    .then(response => {
        if (response.ok) {
            alert("Receita removida com sucesso!");
            carregarTodasReceitas();
        } else {
            return response.json().then(data => {
                alert(data.mensagem || "Erro ao tentar excluir a receita.");
            });
        }
    })
    .catch(error => {
        console.error("Erro no Fetch de exclusão:", error);
    });
}

async function carregarImagemComFetch(idReceita) {
    try {
        const response = await fetch(`http://localhost:8081/site/imagem_receita?id=${idReceita}`);

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const imagemBlob = await response.blob();
        return URL.createObjectURL(imagemBlob);

    } catch (error) {
        console.error("Erro ao carregar a imagem:", error);
        return "assets/images/fundoinicial.png";
    }
}