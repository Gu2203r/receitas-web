package br.edu.ifsp.dao;

import br.edu.ifsp.model.FuncaoUsuario;
import br.edu.ifsp.model.Usuario;

import java.util.List;
import java.util.Map;

public interface UsuarioDAO {

    Usuario inserir(String nome, String email, String senha, FuncaoUsuario funcao);

    // Retorna um map com o email do usuario como chave
    List<Usuario> listar();

    Usuario atualizar(String nome,String email, String senha);

    Usuario buscaPorLogin(String email);

    Usuario excluir(String email);
}
