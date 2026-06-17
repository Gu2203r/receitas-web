package br.edu.ifsp.dao;

import br.edu.ifsp.model.Avaliacao;

import java.util.List;

public interface AvaliacaoDAO {

    Avaliacao inserir(Avaliacao avaliacao);

    List<Avaliacao> listar();

    List<Avaliacao> buscarPorReceita(int idReceita);

    double getMediaReceita(int idReceita);
}
