document.addEventListener("DOMContentLoaded", () => {
    carregarTodasReceitas();
});

function carregarTodasReceitas() {
    const containerLista = document.getElementById('lista-receitas');
    const isAutenticado = sessionStorage.getItem('autenticado');

    fetch(`${API_BASE_URL}/listar`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(receitas => {
        if (!receitas || receitas.length === 0) {
            containerLista.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #555; font-size: 18px;">Nenhuma receita encontrada no sistema.</p>';
            return;
        }

        containerLista.innerHTML = '';

        receitas.forEach(receita => {
            const card = criarCardCompleto(receita, isAutenticado);
            containerLista.appendChild(card);
        });
    })
    .catch(error => {
        console.error("Erro ao carregar a lista de receitas:", error);
        containerLista.innerHTML = '<p style="color: #2b1506; text-align: center;">Erro ao conectar com o servidor para buscar as receitas.</p>';
    });
}

function criarCardCompleto(receita, isAutenticado) {
    const card = document.createElement('div');
    card.className = 'recipe-card';

    const id = receita.id !== undefined ? receita.id : (receita._id || 0);
    const imagemFundo = receita.foto || 'assets/images/fundoinicial.png';

    let htmlCard = `
        <div class="card-image" style="background-image: url('${imagemFundo}');"></div>
        <div class="card-info">
            <h3>${receita.nome}</h3>
            <p><strong>Categoria:</strong> ${receita.categoria ? receita.categoria.replace('_', ' ') : 'Não informada'}<br>
            <strong>Tempo:</strong> ${receita.tempo_preparo} min | <strong>Rendimento:</strong> ${receita.rendimento}</p>
            <a href="detalhes.html?id=${id}" class="btn-link" style="display: block; margin-bottom: 10px;">Ver Receita Completa</a>
    `;

    if (isAutenticado) {
        htmlCard += `
            <div style="display: flex; gap: 15px; border-top: 1px solid #eee; padding-top: 15px; margin-top: 10px;">
                <button onclick="redirecionarParaEdicao(${id})" class="btn-edit" style="font-size: 14px;">✎ Editar</button>
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

    fetch(`${API_BASE_URL}/excluir?id=${id}`, {
        method: 'POST',
        credentials: 'include'
    })
    .then(verificarAutenticacao)
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