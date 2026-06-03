const menu = document.getElementById("menu");

if (sessionStorage.getItem("logado")) {

    menu.innerHTML = `
        <li><a href="index.html">Home</a></li>
        <li><a href="sobre.html">Sobre o Sistema</a></li>
        <li><a href="cadastrar.html">Adicionar Receita</a></li>
        <li><a href="listar.html">Minhas Receitas</a></li>
        <li><a href="#" id="logout">Logout</a></li>
    `;

} else {

    menu.innerHTML = `
        <li><a href="index.html">Home</a></li>
        <li><a href="sobre.html">Sobre o Sistema</a></li>
        <li><a href="login.html">Login</a></li>
    `;
}