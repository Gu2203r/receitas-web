package br.edu.ifsp.dao;

import br.edu.ifsp.model.Categoria;
import br.edu.ifsp.model.Receita;
import br.edu.ifsp.model.Usuario;

import java.util.List;

public interface ReceitaDAO {

    Receita inserir(Receita receita);

    List<Receita> listar();
}
