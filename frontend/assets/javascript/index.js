const destaque = document.getElementById("receitas-destaque");

destaque.innerHTML = `
    <div class="recipe-card">
        <div class="card-image"
             style="background-image:url('assets/images/fundopizza.png')">
        </div>

        <div class="card-info">
            <h3>Pizza Artesanal</h3>
            <p>Prato Principal - 45 min</p>

            <a href="detalhes.html?id=1"
               class="btn-link">
               Ver Receita
            </a>
        </div>
    </div>
`;