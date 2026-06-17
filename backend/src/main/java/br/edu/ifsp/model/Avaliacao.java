package br.edu.ifsp.model;

import java.io.Serializable;

public class Avaliacao implements Serializable {
    private static final long serialVersionUID = 1L;

    private String avaliador;
    private int receita;
    private double nota;
    private String comentario;

    public Avaliacao() {
    }

    public Avaliacao(double nota, String comentario) {
        this.nota = nota;
        this.comentario = comentario;
    }

    public Avaliacao(String avaliador,int receita, double nota, String comentario) {
        this.avaliador = avaliador;
        this.receita = receita;
        this.nota = nota;
        this.comentario = comentario;
    }

    public String getAvaliador() {
        return avaliador;
    }

    public void setAvaliador(String avaliador) {
        this.avaliador = avaliador;
    }

    public int getReceita() {
        return receita;
    }

    public double getNota() {
        return nota;
    }

    public void setNota(double nota) {
        this.nota = nota;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    @Override
    public String toString() {
        return this.avaliador + ";"
                + this.receita + ";"
                + this.nota + ";"
                + escapar(this.comentario);
    }

    // funcao para conseguir salvar as quebras de linhas no DAO
    private String escapar(String texto) {
        if (texto == null) return "";
        return texto.replace("\r\n", "\\n").replace("\n", "\\n").replace("\r", "\\n");
    }
}
