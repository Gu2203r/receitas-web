package br.edu.ifsp.model;

public class Usuario {
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

    public String getEmail() {
        return email;
    }

    public String getSenha() {
        return senha;
    }

    public FuncaoUsuario getFuncao() {
        return funcao;
    }

    @Override
    public String toString() {
        return this.nome + ";" + this.email + ";" + this.senha + ";" + this.funcao;
    }
}
