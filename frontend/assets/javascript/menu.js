document.addEventListener("DOMContentLoaded", () => {
    const menuContainer = document.getElementById('menu');

    let usuario = JSON.parse(sessionStorage.getItem("usuario"));

    if (usuario && usuario.funcao === "ADMIN") {

        menuContainer.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="sobre.html">Sobre o Sistema</a></li>
            <li><a href="listar.html">Receitas</a></li>
            <li><a href="cadastrar.html">Adicionar Receita</a></li>
            <li><a href="usuarios.html">Usuários</a></li>
            <li><a href="editar_usuario.html" class="btn-nav-login">${usuario.nome}</a></li>
            <li><a href="#" id="btn-logout" class="btn-nav-login" style="background-color: #c0392b;">Logout</a></li>
        `;

        document.getElementById('btn-logout').addEventListener('click', (e) => {
            e.preventDefault();
            fazerLogout(usuario.email);
        });
    } else if (usuario && usuario.funcao === "USER") {
        menuContainer.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="sobre.html">Sobre o Sistema</a></li>
            <li><a href="listar.html">Receitas</a></li> 
            <li><a href="editar_usuario.html" class="btn-nav-login">${usuario.nome}</a></li>
            <li><a href="#" id="btn-logout" class="btn-nav-login" style="background-color: #c0392b;">Logout</a></li>
        `;

        document.getElementById('btn-logout').addEventListener('click', (e) => {
            e.preventDefault();
            fazerLogout(usuario.email);
        });
    } else {
        menuContainer.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="sobre.html">Sobre o Sistema</a></li>
            <li><a href="listar.html">Receitas</a></li> 
            <li><a href="login.html" class="btn-nav-login">Login</a></li>
        `;
    }

    configurarBuscaNavbar();
});

// Captura o submit da barra de pesquisa presente em todas as páginas
// e redireciona para a listagem com o termo buscado na URL.
function configurarBuscaNavbar() {
    const formBusca = document.querySelector('.search-container');
    if (!formBusca) return;

    formBusca.addEventListener('submit', (e) => {
        e.preventDefault();

        const input = formBusca.querySelector('input[type="text"]');
        const termo = input.value.trim();

        if (!termo) return;

        window.location.href = `listar.html?busca=${encodeURIComponent(termo)}`;
    });
}

function fazerLogout(email) {

    let json = {
        email: email
    };

    fetch(`http://localhost:8081/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    })
    .then(response => {
        sessionStorage.removeItem('usuario');
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error("Erro ao fazer logout:", error);
        sessionStorage.removeItem('usuario');
        window.location.href = 'login.html';
    });
}