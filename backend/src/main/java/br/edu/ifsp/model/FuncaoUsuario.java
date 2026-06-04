package br.edu.ifsp.model;

public enum FuncaoUsuario {
    ADMIN("Administrador"),
    USER("Usuario");

    private final String funcao;

    FuncaoUsuario(String funcao){
        this.funcao = funcao;
    }

    public String getFuncao() {
        return funcao;
    }
}
