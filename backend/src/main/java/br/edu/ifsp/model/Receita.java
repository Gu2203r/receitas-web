package br.edu.ifsp.model;

import java.io.Serializable;

public class Receita implements Serializable {
    private static final long serialVersionUID = 1L;

    private static int idAtual = 0;

    private int id;
    private String nome;
    private String autor;
    private String tempoPreparo;
    private String ingredientes;
    private String modoPreparo;
    private Categoria categoria;
    private String rendimento;
    private String foto;
    private int visualizacoes;

    public Receita(){

    }

    public Receita(int id, String nome, String autor, String tempoPreparo, String ingredientes, String modoPreparo, Categoria categoria, String rendimento, String foto, int visualizacoes){
        this.id = id;
        this.nome = nome;
        this.autor = autor;
        this.tempoPreparo = tempoPreparo;
        this.ingredientes = ingredientes;
        this.modoPreparo = modoPreparo;
        this.categoria = categoria;
        this.rendimento = rendimento;
        this.foto = foto;
        this.visualizacoes = visualizacoes;
    }

    public void adicionarVisualizacao(){
        this.visualizacoes++;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public String getTempoPreparo() {
        return tempoPreparo;
    }

    public void setTempoPreparo(String tempoPreparo) {
        this.tempoPreparo = tempoPreparo;
    }

    public String getIngredientes() {
        return ingredientes;
    }

    public void setIngredientes(String ingredientes) {
        this.ingredientes = ingredientes;
    }

    public String getModoPreparo() {
        return modoPreparo;
    }

    public void setModoPreparo(String modoPreparo) {
        this.modoPreparo = modoPreparo;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public String getRendimento() {
        return rendimento;
    }

    public void setRendimento(String rendimento) {
        this.rendimento = rendimento;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public int getVisualizacoes() {
        return visualizacoes;
    }

    @Override
    public String toString() {
        return this.id + ";"
                + this.nome + ";"
                + this.autor + ";"
                + this.tempoPreparo + ";"
                + escapar(this.ingredientes) + ";"   // ← escapado
                + escapar(this.modoPreparo) + ";"    // ← escapado
                + this.categoria + ";"
                + this.rendimento + ";"
                + this.foto + ";"
                + this.visualizacoes;
    }

    // funcao para conseguir salvar as quebras de linhas no DAO
    private String escapar(String texto) {
        if (texto == null) return "";
        return texto.replace("\r\n", "\\n").replace("\n", "\\n").replace("\r", "\\n");
    }
}
