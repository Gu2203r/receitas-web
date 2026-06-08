package br.edu.ifsp.dao;

import br.edu.ifsp.model.FuncaoUsuario;
import br.edu.ifsp.model.Usuario;

import java.util.List;

public interface UsuarioDAO {

    Usuario inserir(String nome, String email, String senha, FuncaoUsuario funcao);

    List<Usuario> listar();
}
