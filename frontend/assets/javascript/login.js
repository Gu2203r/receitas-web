document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById('form-login');
    const mensagemErro = document.getElementById('mensagem-erro');

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email_usuario').value;
            const senha = document.getElementById('senha_usuario').value;

            mensagemErro.innerHTML = '';
            mensagemErro.classList.remove('message-error');

            const dadosLogin = {
                login: email,
                senha: senha
            };

            fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosLogin),
                credentials: 'include'
            })
            .then(response => {
                if (response.ok) {
                    sessionStorage.setItem('autenticado', 'true');
                    window.location.href = 'index.html';
                } else if (response.status === 401) {
                    mostrarErro("E-mail ou senha incorretos.");
                } else if (response.status === 400) {
                    return response.json().then(data => {
                        mostrarErro(data.mensagem || "Dados inválidos.");
                    });
                } else {
                    mostrarErro("Erro inesperado ao tentar fazer login.");
                }
            })
            .catch(error => {
                console.error("Erro no Fetch:", error);
                mostrarErro("Erro de conexão com o servidor. Verifique se o backend está rodando.");
            });
        });
    }

    function mostrarErro(mensagem) {
        mensagemErro.textContent = mensagem;
        mensagemErro.classList.add('message-error');
    }
});