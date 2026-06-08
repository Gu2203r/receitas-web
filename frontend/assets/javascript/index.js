document.addEventListener("DOMContentLoaded", () => {
    carregarReceitasHome();
});

function carregarReceitasHome() {
    const containerDestaque = document.getElementById('receitas-destaque');
    const containerPopulares = document.getElementById('receitas-populares');
    const containerNovidadeTexto = document.querySelector('.novidade-texto');

    fetch(`${API_BASE_URL}/listar`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(receitas => {
        if (!receitas || receitas.length === 0) {
            mostrarMensagemVazia();
            return;
        }

        containerDestaque.innerHTML = '';
        containerPopulares.innerHTML = '';

        const destaques = receitas.slice(0, 3);
        destaques.forEach(receita => {
            containerDestaque.appendChild(criarCardReceita(receita, false));
        });

        const novidade = receitas[receitas.length - 1];
        if (novidade && containerNovidadeTexto) {
            containerNovidadeTexto.innerHTML = `
                <h3>${novidade.nome}</h3>
                <p>Uma deliciosa receita de ${novidade.categoria.replace('_', ' ').toLowerCase()} preparada por ${novidade.autor || 'Chef Anônimo'}. Tempo de preparo de apenas ${novidade.tempo_preparo} minutos!</p>
                <br>
                <a href="detalhes.html?id=${receitaId(novidade)}" class="btn-primary" style="width: auto; text-decoration: none; display: inline-block; text-align: center;">
                    Ler Passo a Passo
                </a>
            `;
        }

        const populares = receitas.slice(1, 4);
        populares.forEach(receita => {
            containerPopulares.appendChild(criarCardReceita(receita, true));
        });
    })
    .catch(error => {
        console.error("Erro ao carregar receitas na home:", error);
        if (containerDestaque) containerDestaque.innerHTML = '<p style="color: white;">Erro ao carregar as receitas.</p>';
        if (containerPopulares) containerPopulares.innerHTML = '<p style="color: #2b1506;">Erro ao carregar as receitas.</p>';
    });
}

function criarCardReceita(receita, éPopular) {
    const card = document.createElement('div');
    card.className = 'recipe-card';

    const imagemFundo = receita.foto || 'assets/images/fundoinicial.png';

    let badgePopular = '';
    if (éPopular) {
        badgePopular = `<span class="badge-popular">🔥 Popular</span>`;
    }

    const id = receitaId(receita);

    card.innerHTML = `
        <div class="card-image" style="background-image: url('${imagemFundo}');">
            ${badgePopular}
        </div>
        <div class="card-info">
            <h3>${receita.nome}</h3>
            <p>Por: ${receita.autor || 'La Cuisine'} | Categoria: ${receita.categoria.replace('_', ' ')}</p>
            <a href="detalhes.html?id=${id}" class="btn-link">Ver Receita</a>
        </div>
    `;

    return card;
}

function receitaId(receita) {
    return receita.id !== undefined ? receita.id : (receita._id || 0);
}

function mostrarMensagemVazia() {
    const containerDestaque = document.getElementById('receitas-destaque');
    if (containerDestaque) {
        containerDestaque.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #555;">Nenhuma receita cadastrada ainda.</p>';
    }
}