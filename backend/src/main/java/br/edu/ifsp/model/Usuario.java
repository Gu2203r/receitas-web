package br.edu.ifsp.model;

public class Usuario {
    private String nome;
    private String email;
    private FuncaoUsuario funcao;

    public Usuario(String nome, String email){
        this.nome = nome;
        this.email = email;
        this.funcao = FuncaoUsuario.valueOf("USER");
    }

    public Usuario(String nome, String email, FuncaoUsuario funcao){
        this.nome = nome;
        this.email = email;
        this.funcao = funcao;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public FuncaoUsuario getFuncao() {
        return funcao;
    }
}
