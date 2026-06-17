document.addEventListener("DOMContentLoaded", () => {
    const formCadastro = document.getElementById('form-cadastro');
    const mensagemErro = document.getElementById('mensagem-erro');

    if (formCadastro) {
        formCadastro.addEventListener('submit', (e) => {
            e.preventDefault();

            const nome = document.getElementById('nome_usuario').value;
            const email = document.getElementById('email_usuario').value;
            const senha = document.getElementById('senha_usuario').value;

            mensagemErro.innerHTML = '';
            mensagemErro.classList.remove('message-error');

            const dadosUsuario = {
                nome: nome,
                email: email,
                senha: senha
            };

            fetch("http://localhost:8081/site/cadastro_usuario", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosUsuario)
            })
            .then(response => {
                if (response.ok) {
                    alert("Conta criada com sucesso! Podes fazer login agora.");
                    window.location.href = 'login.html';
                } else if (response.status === 400) {
                    return response.json().then(data => {
                        mostrarErro(data.problemas);
                    });
                } else {
                    mostrarErro("Erro inesperado ao tentar criar a conta.");
                }
            })
            .catch(error => {
                console.error("Erro no Fetch:", error);
                mostrarErro("Erro de conexão com o servidor. Verifica se o backend (Tomcat/Servlets) está a correr.");
            });
        });
    }

    function mostrarErro(mensagem) {
        mensagemErro.textContent = mensagem;
        mensagemErro.classList.add('message-error');
        mensagemErro.style.color = "#c0392b";
        mensagemErro.style.marginBottom = "15px";
        mensagemErro.style.textAlign = "center";
    }
});