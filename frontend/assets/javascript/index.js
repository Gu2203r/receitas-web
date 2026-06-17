document.addEventListener("DOMContentLoaded", () => {
    carregarReceitasHome();
});

async function carregarReceitasHome() {
    try {
        const response = await fetch(`http://localhost:8081/site/iniciar`);

        if (!response.ok) throw new Error(`Status ${response.status}`);

        const dados = await response.json();

        // sem receitas cadastradas
        if (dados.mensagem) {
            mostrarMensagemVazia();
            return;
        }

        await Promise.all([
            renderizarMelhoresAvaliadas(dados.melhoresAvaliadas),
            renderizarNovidade(dados.novidade),
            renderizarPrimeirasAdicionadas(dados.primeirasAdicionadas)
        ]);

    } catch (error) {
        console.error("Erro ao carregar receitas na home:", error);
        mostrarErroCarregamento();
    }
}

// melhores avaliadas

async function renderizarMelhoresAvaliadas(receitas) {
    const container = document.getElementById('receitas-destaque');
    if (!container || !receitas || receitas.length === 0) return;

    container.innerHTML = '';

    for (const receita of receitas) {
        const card = await criarCard(receita, false);
        container.appendChild(card);
    }
}

// ultima adicionada

async function renderizarNovidade(receita) {
    if (!receita) return;

    const banner = document.querySelector('.novidade-banner img');
    const texto  = document.querySelector('.novidade-texto');

    if (!banner || !texto) return;

    // Carrega a imagem da novidade no banner
    const imagemUrl = await carregarImagem(receita.id);
    banner.src = imagemUrl;
    banner.alt = receita.nome;

    const categoria = receita.categoria
        ? receita.categoria.replace(/_/g, ' ').toLowerCase()
        : 'culinária';

    texto.innerHTML = `
        <h3>${receita.nome}</h3>
        <p>
            Uma deliciosa receita de <strong>${categoria}</strong>

            Tempo de preparo de apenas <strong>${receita.tempoPreparo} minutos</strong>!
        </p>
        <br>
        <a href="detalhes.html?id=${receita.id}"
           class="btn-primary"
           style="width: auto; text-decoration: none; display: inline-block; text-align: center;">
            Ler Passo a Passo
        </a>
    `;
}

// exibir as 3 primeiras adicionadas

async function renderizarPrimeirasAdicionadas(receitas) {
    const container = document.getElementById('receitas-primeiras');
    if (!container || !receitas || receitas.length === 0) return;

    container.innerHTML = '';

    for (const receita of receitas) {
        const card = await criarCard(receita, false);
        container.appendChild(card);
    }
}

// criacao dos cards

async function criarCard(receita, isPopular) {
    const card = document.createElement('div');
    card.className = 'recipe-card';

    const imagemUrl = await carregarImagem(receita.id);

    const badge = isPopular ? `<span class="badge-popular">🔥 Popular</span>` : '';
    const categoria = receita.categoria
        ? receita.categoria.replace(/_/g, ' ')
        : 'Não informada';

    card.innerHTML = `
        <div class="card-image" style="background-image: url('${imagemUrl}');">
            ${badge}
        </div>
        <div class="card-info">
            <h3>${receita.nome}</h3>
            <p>
                <strong>${'La Cuisine'}</strong> &middot; ${categoria}
            </p>
            <a href="detalhes.html?id=${receita.id}" class="btn-link">Ver Receita</a>
        </div>
    `;

    return card;
}

// imagem das receitas

async function carregarImagem(idReceita) {
    try {
        const response = await fetch(`http://localhost:8081/site/imagem_receita?id=${idReceita}`);
        if (!response.ok) throw new Error(`Status ${response.status}`);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch {
        return 'assets/images/fundoinicial.png';
    }
}


// mensagens de erro
function mostrarMensagemVazia() {
    const containers = ['receitas-destaque', 'receitas-primeiras'];
    containers.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #555;">Nenhuma receita cadastrada ainda.</p>';
    });
}

function mostrarErroCarregamento() {
    const containers = ['receitas-destaque', 'receitas-primeiras'];
    containers.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #c0392b;">Erro ao carregar as receitas. Verifique o servidor.</p>';
    });
}