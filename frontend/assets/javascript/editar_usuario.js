document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        alert("Usuário não identificado.");
        window.location.href = 'usuarios.html';
        return;
    }

    carregarDadosUsuario(id);
    configurarFormulario(id);
});

function carregarDadosUsuario(id) {

    fetch(`${API_BASE_URL}/obterUsuario?id=${id}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao buscar dados do usuário.");
        }
        return response.json();
    })
    .then(usuario => {
        document.getElementById('nome_usuario').value = usuario.nome || '';
        document.getElementById('email_usuario').value = usuario.email || '';
    })
    .catch(error => {
        console.error("Erro ao carregar dados:", error);
        alert("Não foi possível carregar os dados do usuário.");
    });
}

function configurarFormulario(id) {
    const formEditar = document.getElementById('form-editar-usuario');

    formEditar.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome_usuario').value;
        const email = document.getElementById('email_usuario').value;

        const dadosAtualizados = {
            id: id,
            nome: nome,
            email: email
        };

        fetch(`${API_BASE_URL}/atualizarUsuario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAtualizados),
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                alert("Usuário atualizado com sucesso!");
                window.location.href = 'usuarios.html';
            } else {
                return response.json().then(data => {
                    alert(data.mensagem || "Erro ao atualizar o usuário.");
                });
            }
        })
        .catch(error => {
            console.error("Erro no Fetch de atualização:", error);
            alert("Erro de conexão com o servidor.");
        });
    });
}