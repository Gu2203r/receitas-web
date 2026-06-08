package br.edu.ifsp.dao;

import br.edu.ifsp.model.FuncaoUsuario;
import br.edu.ifsp.model.Usuario;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

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

        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return listaUsuarios;
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
}
