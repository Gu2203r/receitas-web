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
                email: email,
                senha: senha
            };

            fetch("http://localhost:8081/site/logar", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosLogin)
            })
            .then(async response => {
                let data = await response.json()
                
                if (response.ok) {
                    console.log("resposta ok")
                    
                    return data
                }  else {
                    console.log("algum erro ocoreu")
                    mostrarErro(data.problemas);
                    return data
                }
            })
            .then(dados => {
                console.log(dados)
                if(dados.usuario){
                    sessionStorage.setItem("usuario", JSON.stringify(dados.usuario))
                    window.location.href = "index.html"
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