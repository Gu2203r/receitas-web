document.addEventListener("DOMContentLoaded", () => {
    carregarTodosUsuarios();
});

function carregarTodosUsuarios() {
    const containerLista = document.getElementById('lista-usuarios');

    fetch(`${API_BASE_URL}/listarUsuarios`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(usuarios => {
        if (!usuarios || usuarios.length === 0) {
            containerLista.innerHTML = '<p style="text-align: center; color: #555; font-size: 18px;">Nenhum usuário encontrado no sistema.</p>';
            return;
        }

        containerLista.innerHTML = '';

        usuarios.forEach(usuario => {

            const id = usuario.id !== undefined ? usuario.id : (usuario._id || 0);

            const divUsuario = document.createElement('div');
            divUsuario.style.cssText = "background: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center;";

            divUsuario.innerHTML = `
                <div>
                    <h3 style="margin: 0; color: #2b1506; font-size: 18px;">${usuario.nome || 'Nome não informado'}</h3>
                    <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">${usuario.email || 'E-mail não informado'}</p>
                </div>
                <div>
                    <button onclick="excluirUsuario(${id})" class="btn-primary" style="background-color: #c0392b; width: auto; padding: 8px 15px; font-size: 14px;">✖ Excluir</button>
                </div>
            `;

            containerLista.appendChild(divUsuario);
        });
    })
    .catch(error => {
        console.error("Erro ao carregar a lista de usuários:", error);
        containerLista.innerHTML = '<p style="color: #2b1506; text-align: center;">Erro ao conectar com o servidor para buscar os usuários.</p>';
    });
}

function excluirUsuario(id) {
    if (!confirm("Tem certeza que deseja excluir este usuário definitivamente?")) {
        return;
    }

    fetch(`${API_BASE_URL}/excluirUsuario?id=${id}`, {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            alert("Usuário removido com sucesso!");
            carregarTodosUsuarios();
        } else {
            return response.json().then(data => {
                alert(data.mensagem || "Erro ao tentar excluir o usuário.");
            });
        }
    })
    .catch(error => {
        console.error("Erro no Fetch de exclusão:", error);
    });
}