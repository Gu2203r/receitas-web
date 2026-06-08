document.addEventListener("DOMContentLoaded", () => {

    const isAutenticado = sessionStorage.getItem('autenticado');
    if (!isAutenticado) {
        alert("Acesso negado. Por favor, faça login para editar receitas.");
        window.location.href = 'login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const receitaId = urlParams.get('id');

    if (!receitaId) {
        alert("Nenhuma receita selecionada para edição.");
        window.location.href = 'listar.html';
        return;
    }

    carregarDadosReceita(receitaId);

    configurarFormularioEdicao(receitaId);
});

function carregarDadosReceita(id) {
    fetch(`${API_BASE_URL}/detalhes?id=${id}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 401) {
            sessionStorage.removeItem('autenticado');
            window.location.href = 'login.html';
            throw new Error('Sessão expirada');
        }
        if (!response.ok) {
            throw new Error('Receita não encontrada');
        }
        return response.json();
    })
    .then(receita => {

        document.getElementById('nome').value = receita.nome || '';
        document.getElementById('categoria').value = receita.categoria || 'PRATO_PRINCIPAL';
        document.getElementById('tempo_preparo').value = receita.tempo_preparo || '';
        document.getElementById('rendimento').value = receita.rendimento || '';
        document.getElementById('ingredientes').value = receita.ingredientes || '';
        document.getElementById('modo_preparo').value = receita.modo_preparo || '';

        const fotoAtual = document.getElementById('foto-atual');
        if (fotoAtual) {
            if (receita.foto) {
                fotoAtual.textContent = `Uma imagem já está salva. Selecione um novo arquivo apenas se quiser substituí-la.`;
            } else {
                fotoAtual.textContent = `Nenhuma imagem cadastrada anteriormente.`;
            }
        }
    })
    .catch(error => {
        console.error("Erro ao carregar os dados da receita:", error);
        if (error.message !== 'Sessão expirada') {
            alert("Erro ao carregar os dados para edição.");
            window.location.href = 'listar.html';
        }
    });
}

function configurarFormularioEdicao(id) {
    const formEditar = document.getElementById('form-editar');

    if (formEditar) {
        formEditar.addEventListener('submit', (e) => {
            e.preventDefault();
            limparMensagensErro();

            const formData = new FormData(formEditar);
            formData.append('id', id);

            fetch(`${API_BASE_URL}/editar`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            })
            .then(verificarAutenticacao)
            .then(response => {
                if (response.ok) {
                    return response.json().then(data => {
                        alert(data.mensagem || "Receita atualizada com sucesso!");
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
                console.error("Erro ao atualizar receita:", error);
                if (error.message !== 'Sessão expirada ou não autorizada.') {
                    mostrarErroGeral("Ocorreu um erro ao tentar atualizar a receita. Verifique os dados e tente novamente.");
                }
            });
        });
    }
}

function mostrarErrosValidacao(data) {
    const form = document.getElementById('form-editar');
    const errorContainer = document.createElement('div');
    errorContainer.className = 'message-error container-erros-dinamicos';

    let htmlErro = `<strong>${data.mensagem || 'Verifique os seguintes problemas:'}</strong><br>`;

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
    const form = document.getElementById('form-editar');
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