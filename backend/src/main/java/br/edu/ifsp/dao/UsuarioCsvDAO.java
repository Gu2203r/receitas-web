package br.edu.ifsp.dao;

import br.edu.ifsp.model.FuncaoUsuario;
import br.edu.ifsp.model.Usuario;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UsuarioCsvDAO  implements UsuarioDAO{

    private String path = null;

    public UsuarioCsvDAO(String path){
        this.path = path + "Usuario.csv";
    }

    @Override
    public Usuario inserir(String nome, String email, String senha, FuncaoUsuario funcao) {
        Usuario u = null;

        try {
            checkFile();

            FileWriter fw = new FileWriter(path, true);
            PrintWriter pw = new PrintWriter(fw);

            if (funcao != null){
                u = new Usuario(nome, email, senha, funcao);
            }else {
                u = new Usuario(nome, email, senha);
            }

            pw.println(u);
            pw.close();
            fw.close();

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return u;
    }

    @Override
    public List<Usuario> listar() {
        List<Usuario> listaUsuarios = new ArrayList<>();

        try {
            checkFile();

            FileReader fr = new FileReader(path);
            BufferedReader br = new BufferedReader(fr);

            String linha;

            while ((linha = br.readLine()) != null){
                String[] partes = linha.split(";");

                Usuario u = new Usuario(partes[0], partes[1], partes[2], FuncaoUsuario.valueOf(partes[3]));

                listaUsuarios.add(u);
            }

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return listaUsuarios;
    }

    @Override
    public Usuario atualizar(String nome,String email, String senha) {

        Usuario usuario = buscaPorLogin(email);
        usuario.setNome(nome);
        usuario.setSenha(senha);

        reescrever(usuario, false);

        return usuario;
    }

    @Override
    public Usuario buscaPorLogin(String email) {

        List<Usuario> listaUsuarios = listar();

        return listaUsuarios.stream()
                .filter(u -> u.getEmail().equals(email))
                .findFirst()
                .orElse(null);
    }

    @Override
    public Usuario excluir(String email) {
        Usuario usuario = buscaPorLogin(email);

        if (usuario != null){
            reescrever(usuario, true);
        }

        return usuario;
    }

    private void checkFile(){

        File file = new File(path);
        if(!file.exists()){
            try {
                file.createNewFile();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    // Reescreve o CSV após uma edição ou remoção.
    // Se excluir=true, remove o usuario da lista antes de reescrever.
    // Se excluir=false, substitui os dados do usuario existente pelos novos.
    private void reescrever(Usuario usuario, boolean excluir){

        List<Usuario> listaUsuarios = listar();

        // verifica se quer excluir ou editar
        if (excluir){
            listaUsuarios.remove(usuario);
        }else {
            listaUsuarios.stream()
                    .filter(u -> u.getEmail().equals(usuario.getEmail()))
                    .findFirst()
                    .ifPresent(u -> {
                        u.setNome(usuario.getNome());
                        u.setSenha(usuario.getSenha());
                    });
        }

        try (FileWriter writer = new FileWriter(path)) {
            writer.write(""); // Sobrescreve com uma string vazia
        } catch (IOException e) {
            System.out.println("Erro ao limpar o arquivo: " + e.getMessage());
        }

        // reescreve o arquivo anterior com a nova lista de usuarios
        listaUsuarios.forEach(u -> inserir(u.getNome(), u.getEmail(), u.getSenha(), u.getFuncao()));
    }
}
