package br.edu.ifsp.model;

import java.io.Serializable;

public class Usuario implements Serializable {
    private String nome;
    private String email;
    private String senha;
    private FuncaoUsuario funcao;

    public Usuario(String nome, String email, String senha){
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.funcao = FuncaoUsuario.valueOf("USER");
    }

    public Usuario(String nome, String email, String senha, FuncaoUsuario funcao){
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.funcao = funcao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public FuncaoUsuario getFuncao() {
        return funcao;
    }

    @Override
    public String toString() {
        return this.nome + ";" + this.email + ";" + this.senha + ";" + this.funcao;
    }
}
