document.addEventListener("DOMContentLoaded", () => {

    const usuario = sessionStorage.getItem('usuario');

    if (!usuario) {
        alert("Usuário não identificado.");
        window.location.href = 'index.html';
        return;
    }

    const user = JSON.parse(usuario);

    carregarDadosUsuario(user);
    configurarFormulario(user);
});

function carregarDadosUsuario(usuario) {
    document.getElementById('nome_usuario').value = usuario.nome || '';
}

function configurarFormulario(user) {
    const formEditar = document.getElementById('form-editar-usuario');

    formEditar.addEventListener('submit', (e) => {
        e.preventDefault();
        limparErros();

        const nome = document.getElementById('nome_usuario').value.trim();
        const senhaAtual = document.getElementById('senha_atual').value;
        const novaSenha = document.getElementById('nova_senha').value;
        const confirmar = document.getElementById('confirmar_senha').value;

        let valido = true;

        if (!nome) {
            mostrarErro('erro_nome', 'Informe seu nome.');
            valido = false;
        }

        if (!senhaAtual) {
            mostrarErro('erro_senha_atual', 'Informe sua senha atual.');
            valido = false;
        } else if (senhaAtual !== user.senha) {
            mostrarErro('erro_senha_atual', 'Senha atual incorreta.');
            valido = false;
        }

        if (!novaSenha) {
            mostrarErro('erro_nova_senha', 'Informe a nova senha.');
            valido = false;
        } else if (novaSenha.length < 6) {
            mostrarErro('erro_nova_senha', 'A nova senha deve ter pelo menos 6 caracteres.');
            valido = false;
        }

        if (!confirmar) {
            mostrarErro('erro_confirmar', 'Confirme a nova senha.');
            valido = false;
        } else if (novaSenha !== confirmar) {
            mostrarErro('erro_confirmar', 'As senhas não coincidem.');
            valido = false;
        }

        if (!valido) return;


        const json = {
            nome:  nome,
            email: user.email,
            senha: novaSenha
        };

        fetch(`http://localhost:8081/site/editar_usuario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(json)
        })
        .then(async response => {
            const data = await response.json();
            if (response.ok) {
                sessionStorage.setItem("usuario", JSON.stringify(data.usuario));
                alert("Perfil atualizado com sucesso!");
                window.location.href = 'index.html';
            } else {
                alert(data.mensagem || "Erro ao atualizar o usuário.");
            }
        })
        .catch(error => {
            console.error("Erro ao atualizar usuário:", error);
            alert("Erro de conexão com o servidor.");
        });
    });
}

function mostrarErro(elementoId, mensagem) {
    const el = document.getElementById(elementoId);
    if (el) {
        el.textContent = mensagem;
        el.style.display = 'block';
    }
}

function limparErros() {
    document.querySelectorAll('.campo-erro').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}