document.addEventListener("DOMContentLoaded", () => {

    const isAutenticado = sessionStorage.getItem('autenticado');
    if (!isAutenticado) {
        alert("Acesso negado. Por favor, faça login para cadastrar receitas.");
        window.location.href = 'login.html';
        return;
    }

    const formCadastrar = document.getElementById('form-cadastrar');

    if (formCadastrar) {
        formCadastrar.addEventListener('submit', (e) => {
            e.preventDefault();

            limparMensagensErro();

            const formData = new FormData(formCadastrar);

            fetch(`${API_BASE_URL}/cadastrar`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            })
            .then(verificarAutenticacao)
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
                } else {
                    throw new Error("Erro inesperado no servidor.");
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