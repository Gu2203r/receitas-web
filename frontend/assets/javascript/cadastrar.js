document.addEventListener("DOMContentLoaded", () => {

    const user = sessionStorage.getItem('usuario');
    if (user) {
        let usuarioLogado = JSON.parse(user)
        
        if (usuarioLogado.funcao === "USER"){
            alert("Acesso negado. Por favor, faça login para cadastrar receitas.");
            window.location.href = 'login.html';
            return;
        }
    }else{
        alert("Acesso negado. Por favor, faça login para cadastrar receitas.");
        window.location.href = 'login.html';
        return;
        
    }

    const formCadastrar = document.getElementById('form-cadastrar');

    if (formCadastrar) {
        formCadastrar.addEventListener('submit', async (e) => {
            e.preventDefault();

            limparMensagensErro();

            let nome = document.querySelector("#nome").value
            let categoria = document.querySelector("#categoria").value
            let tempoPreparo = document.querySelector("#tempo_preparo").value
            let rendimento = document.querySelector("#rendimento").value
            let ingredientes = document.querySelector("#ingredientes").value
            let modoPreparo = document.querySelector("#modo_preparo").value

            // usa essa funcao para transformar a imagem em base64
            let foto = await processarImagem()

            console.log(foto)

            let dadosReceita = {
                nome : nome,
                categoria : categoria,
                tempoPreparo : tempoPreparo,
                rendimento : rendimento,
                ingredientes : ingredientes,
                modoPreparo : modoPreparo,
                foto : foto
            }
            
            await fetch("http://localhost:8081/site/cadastrar_receita", {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify(dadosReceita)
            })
            .then(response => {
                if (response.ok) {
                    return response.json().then(data => {

                        alert(data.mensagem || "Receita cadastrada com sucesso!");
                        window.location.href = 'listar.html';
                    });
                } else if (response.status === 400) {
                    return response.json().then(data => {
                        mostrarErrosValidacao(data);
                    });
                } else if(response.status === 401) {
                    sessionStorage.clear();
                    window.location.href = 'login.html'
                }
            })
            .catch(error => {
                console.error("Erro no cadastro:", error);
                if (error.message !== 'Sessão expirada ou não autorizada.') {
                    mostrarErroGeral("Ocorreu um erro ao tentar cadastrar a receita. Tente novamente mais tarde.");
                }
            });
        });
    }
});

function mostrarErrosValidacao(data) {
    const form = document.getElementById('form-cadastrar');
    const errorContainer = document.createElement('div');
    errorContainer.className = 'message-error container-erros-dinamicos';

    let htmlErro = `<strong>${data.mensagem || 'Não foi possível cadastrar a receita:'}</strong><br>`;

    if (data.problemas && data.problemas.length > 0) {
        htmlErro += `<ul style="margin-top: 10px; margin-left: 20px;">`;
        data.problemas.forEach(prob => {
            htmlErro += `<li>${prob}</li>`;
        });
        htmlErro += `</ul>`;
    }

    errorContainer.innerHTML = htmlErro;
    form.parentNode.insertBefore(errorContainer, form);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function mostrarErroGeral(mensagem) {
    const form = document.getElementById('form-cadastrar');
    const errorContainer = document.createElement('div');
    errorContainer.className = 'message-error container-erros-dinamicos';
    errorContainer.textContent = mensagem;

    form.parentNode.insertBefore(errorContainer, form);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function limparMensagensErro() {
    const errosAntigos = document.querySelectorAll('.container-erros-dinamicos');
    errosAntigos.forEach(erro => erro.remove());
}

async function processarImagem() {
    const input = document.getElementById('foto');
    const file = input.files[0];

    if (!file) {
        alert("Por favor, selecione uma imagem primeiro.");
        return;
    }

    try {

        // O codigo espera a conversao terminar e guarda o retorno na variavel
        const meuBase64Puro = await converterParaBase64(file);
        
        console.log("Base64 Puro resgatado com sucesso!");
        console.log(meuBase64Puro);
        
        return meuBase64Puro;

    } catch (erro) {
        console.error("Erro ao converter a imagem:", erro);
    }
}

function converterParaBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // O que acontece quando a leitura dá certo
        reader.onload = function(event) {
            const base64Completo = event.target.result;
            const base64Puro = base64Completo.split(',')[1];
            
            // Resolvemos a Promise retornando o base64 puro
            resolve(base64Puro); 
        };

        // O que acontece se houver um erro na leitura
        reader.onerror = function(error) {
            reject(error);
        };

        // Inicia a leitura
        reader.readAsDataURL(file);
    });
}