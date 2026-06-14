document.addEventListener("DOMContentLoaded", () => {
    const menuContainer = document.getElementById('menu');

    const isAutenticado = sessionStorage.getItem('autenticado');

    if (isAutenticado) {
        menuContainer.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="sobre.html">Sobre o Sistema</a></li>
            <li><a href="listar.html">Receitas</a></li>
            <li><a href="cadastrar.html">Adicionar Receita</a></li>
            <li><a href="usuarios.html">Usuários</a></li>
            <li><a href="#" id="btn-logout" class="btn-nav-login" style="background-color: #c0392b;">Logout</a></li>
        `;

        document.getElementById('btn-logout').addEventListener('click', (e) => {
            e.preventDefault();
            fazerLogout();
        });
    } else {
        menuContainer.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="sobre.html">Sobre o Sistema</a></li>
            <li><a href="listar.html">Receitas</a></li> <li><a href="login.html" class="btn-nav-login">Login</a></li>
        `;
    }
});

function fazerLogout() {
    fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        sessionStorage.removeItem('autenticado');
        window.location.href = 'login.html';
    })
    .catch(error => {
        console.error("Erro ao fazer logout:", error);
        sessionStorage.removeItem('autenticado');
        window.location.href = 'login.html';
    });
}