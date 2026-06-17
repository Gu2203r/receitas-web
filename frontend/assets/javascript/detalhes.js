document.addEventListener("DOMContentLoaded", () => {
    const id = obterIdDaUrl();
 
    if (!id) {
        exibirErro("ID da receita não encontrado na URL.");
        return;
    }
 
    carregarDetalhesReceita(id);
    carregarAvaliacoes(id);
    configurarFormAvaliacao(id);
});
 
// Extrai o id da URL da página
function obterIdDaUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}
 
function carregarDetalhesReceita(id) {
    fetch(`http://localhost:8081/site/detalhes_receita?id=${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Receita não encontrada (status ${response.status})`);
            }
            return response.json();
        })
        .then(async receita => {
            preencherCampos(receita);
        })
        .catch(error => {
            console.error("Erro ao carregar detalhes da receita:", error);
        });
}
 
function preencherCampos(receita) {
    document.getElementById("nome-receita").textContent = receita.nome || "Sem nome";
 
    document.getElementById("tempo-receita").textContent =
        `⏱️ ${receita.tempoPreparo ? receita.tempoPreparo + " min" : "Não informado"}`;
 
    document.getElementById("rendimento-receita").textContent =
        `🍽️ ${receita.rendimento || "Não informado"}`;
 
    document.getElementById("categoria-receita").textContent =
        `🏷️ ${receita.categoria ? receita.categoria.replace(/_/g, " ") : "Não informada"}`;
 
    document.getElementById("autor-receita").textContent =
        `👤 ${receita.autor || "Desconhecido"}`;
 
    // Conteúdo
    document.getElementById("ingredientes-receita").textContent =
        receita.ingredientes || "Ingredientes não informados.";
 
    document.getElementById("modo-preparo").textContent =
        receita.modoPreparo || "Modo de preparo não informado.";
 
    // Atualiza o titulo da aba do navegador
    document.title = `${receita.nome} - La Cuisine Brasil`;
}

function carregarAvaliacoes(idReceita) {
    fetch(`http://localhost:8081/site/listar_avaliacao?id=${idReceita}`)
        .then(response => {
            if (!response.ok) throw new Error(`Status ${response.status}`);
            return response.json();
        })
        .then(avaliacoes => renderizarAvaliacoes(avaliacoes))
        .catch(error => {
            console.error("Erro ao carregar avaliações:", error);
        });
}
 
function renderizarAvaliacoes(avaliacoes) {
    const lista = document.getElementById("lista-comentarios");
 
    if (!avaliacoes || avaliacoes.length === 0) {
        lista.innerHTML = `
            <div class="comentario-card">
                <p>Nenhuma avaliação ainda. Seja o primeiro a comentar!</p>
            </div>`;
        return;
    }
 
    lista.innerHTML = avaliacoes.map(avaliacao => `
        <div class="comentario-card">
            <div class="comentario-header">
                <strong>${avaliacao.avaliador || "Anônimo"}</strong>
                <span>${renderizarEstrelas(avaliacao.nota)}</span>
            </div>
            <p>${avaliacao.comentario || ""}</p>
        </div>
    `).join('');
}
 
function renderizarEstrelas(nota) {
    const n = Math.max(0, Math.min(5, parseInt(nota) || 0));
    return "⭐".repeat(n) + "☆".repeat(5 - n);
}
 
 
function configurarFormAvaliacao(idReceita) {
    const form = document.getElementById("form-avaliacao");
 
    // Esconde o formulário se o usuário não estiver logado
    const usuario = sessionStorage.getItem('usuario');
    if (!usuario) {
        form.innerHTML = `
            <p style="color: #888; font-size: 14px;">
                <a href="login.html" class="btn-link">Faça login</a> para deixar sua avaliação.
            </p>`;
        return;
    }
 
    form.addEventListener("submit", (e) => {
        e.preventDefault();
 
        const nota = parseInt(document.getElementById("nota").value);
        const comentario = document.getElementById("comentario").value.trim();
 
        if (!comentario) {
            mostrarFeedback(form, "Por favor, escreva um comentário.", "erro");
            return;
        }
 
        const json = {
            receita: parseInt(idReceita),
            nota: nota,
            comentario: comentario
        };
 
        fetch(`http://localhost:8081/site/avaliar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(json)
        })
        .then(response => response.json().then(data => ({ status: response.status, data })))
        .then(({ status, data }) => {
            if (status === 200) {
                mostrarFeedback(form, data.mensagem || "Avaliação publicada com sucesso!", "sucesso");
                form.reset();
                // Recarrega a lista para exibir o novo comentário imediatamente
                carregarAvaliacoes(idReceita);
            } else if (status === 400) {
                const problemas = data.problemas ? data.problemas.join(", ") : data.mensagem;
                mostrarFeedback(form, problemas, "erro");
            } else if (status === 401) {
                mostrarFeedback(form, "Sessão expirada. Faça login novamente.", "erro");
            } else {
                mostrarFeedback(form, "Erro inesperado. Tente novamente.", "erro");
            }
        })
        .catch(error => {
            console.error("Erro ao enviar avaliação:", error);
            mostrarFeedback(form, "Erro ao conectar com o servidor.", "erro");
        });
    });
}
 
// Exibe uma mensagem de feedback logo acima do botão de submit
function mostrarFeedback(form, mensagem, tipo) {
    const feedbackAnterior = form.querySelector(".feedback-avaliacao");
    if (feedbackAnterior) feedbackAnterior.remove();
 
    const div = document.createElement("div");
    div.className = "feedback-avaliacao message-error";
    div.style.marginBottom = "12px";
 
    if (tipo === "sucesso") {
        div.style.background = "rgba(39, 174, 96, 0.12)";
        div.style.borderColor = "#27ae60";
        div.style.color = "#a8f0c6";
    }
 
    div.textContent = mensagem;
 
    const botao = form.querySelector("button[type='submit']");
    form.insertBefore(div, botao);
}
 
 
function exibirErro(mensagem) {
    const main = document.querySelector("main");
    main.innerHTML = `
        <div style="text-align: center; padding: 80px 20px; color: #2b1506;">
            <h2>Ops, algo deu errado</h2>
            <p style="margin-top: 15px; color: #555;">${mensagem}</p>
            <a href="listar.html" class="btn-primary"
               style="display: inline-block; margin-top: 30px; padding: 10px 25px; width: auto;">
                ← Voltar para as receitas
            </a>
        </div>`;
}
 