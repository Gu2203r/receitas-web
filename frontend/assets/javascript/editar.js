document.addEventListener("DOMContentLoaded", () => {

    const user = sessionStorage.getItem('usuario');
    if (user) {
        let usuarioLogado = JSON.parse(user)
        
        if (usuarioLogado.funcao === "USER"){
            alert("Acesso negado. Voce nao tem premissão para realizar essa ação.");
            window.location.href = 'index.html';
            return;
        }
    }else{
        alert("Acesso negado. Voce nao tem premissão para realizar essa ação.");
        window.location.href = 'index.html';
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
    
    fetch(`http://localhost:8081/site/detalhes_receita?id=${id}`)
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

        document.getElementById('tempo_preparo').value = receita.tempoPreparo || '';
        document.getElementById('rendimento').value = receita.rendimento || '';
        document.getElementById('ingredientes').value = receita.ingredientes || '';
        document.getElementById('modo_preparo').value = receita.modoPreparo || '';

        const fotoAtual = document.getElementById('foto-atual');
        if (fotoAtual) {
            fotoAtual.textContent = receita.foto
                ? 'Uma imagem já está salva. Selecione um novo arquivo apenas se quiser substituí-la.'
                : 'Nenhuma imagem cadastrada anteriormente.';
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

    if (!formEditar) return;

    formEditar.addEventListener('submit', async (e) => {
        e.preventDefault();
        limparMensagensErro();

        // Converte a foto para base64 se o usuário selecionou uma nova
        const fotoInput = document.getElementById('foto');
        let fotoBase64 = null;

        if (fotoInput.files && fotoInput.files[0]) {
            fotoBase64 = await converterParaBase64(fotoInput.files[0]);
        }

        // Monta o payload como JSON, igual ao CadastrarReceitaServlet espera
        const json = {  
            id: parseInt(id),
            nome: document.getElementById('nome').value,
            categoria: document.getElementById('categoria').value,
            tempoPreparo: document.getElementById('tempo_preparo').value,
            rendimento: document.getElementById('rendimento').value,
            ingredientes: document.getElementById('ingredientes').value,
            modoPreparo: document.getElementById('modo_preparo').value,
            foto: fotoBase64  // null se o usuário não selecionou nova foto
        };

        fetch(`http://localhost:8081/site/editar_receita`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(json)
        })
        .then(async response => {
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

// Lê o arquivo de imagem selecionado e retorna como string base64
function converterParaBase64(arquivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); // já vem como "data:image/...;base64,..."
        reader.onerror = () => reject(new Error('Erro ao ler o arquivo de imagem.'));
        reader.readAsDataURL(arquivo);
    });
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
    document.querySelectorAll('.container-erros-dinamicos')
            .forEach(erro => erro.remove());
}