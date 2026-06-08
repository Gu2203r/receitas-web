package br.edu.ifsp.controller;

import br.edu.ifsp.dao.UsuarioDAO;
import br.edu.ifsp.model.FuncaoUsuario;
import br.edu.ifsp.model.Usuario;
import com.google.gson.Gson;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet(name = "CadastroUsuarioServlet", value = "/cadastro_usuario")
public class CadastroUsuarioServlet extends HttpServlet {

    private final Gson gson = new Gson();

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        super.doOptions(request, response);
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        String contentType = request.getContentType();
        String nome;
        String email;
        String senha;
        FuncaoUsuario funcao;

        if(contentType.contains("application/json")){
            StringBuilder sb = new StringBuilder();
            BufferedReader br = request.getReader();

            String linha;

            while ((linha = br.readLine()) != null){
                sb.append(linha);
            }

            Usuario user = gson.fromJson(sb.toString(), Usuario.class);
            nome = user.getNome();
            email = user.getEmail();
            senha = user.getSenha();
            funcao = user.getFuncao();
            System.out.println("entra aqui");

        }else {
            nome = "";
            email = "";
            senha = "";
            funcao = null;
        }

        List<String> listaMensagens = new ArrayList<>();

        if (nome.isEmpty()){
            listaMensagens.add("Nome ivalido");
            System.out.println("nome invalida");
        }

        if (email.isEmpty()){
            listaMensagens.add("Email invalido");
            System.out.println("email invalida");
        }

        if (senha.isEmpty()){
            listaMensagens.add("Senha invalida");
            System.out.println("senha invalida");
        }

        Map<String, Object> mensagem = new HashMap<>();

        if (!listaMensagens.isEmpty()){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            System.out.println("Algum erro ocorreu ao cadastrar usuario");
            mensagem.put("mensagem", "Houve um problema");
            mensagem.put("problemas", listaMensagens);
        }else {
            UsuarioDAO dao = (UsuarioDAO) getServletContext().getAttribute("daoUsuario");
            Usuario u;

            if (funcao == null){
                u = dao.inserir(nome, email, senha, FuncaoUsuario.valueOf("USER"));
            }else {
                u = dao.inserir(nome, email, senha, FuncaoUsuario.valueOf("ADMIN"));
            }
            response.setStatus(HttpServletResponse.SC_OK);
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter pw = response.getWriter();

        pw.println(gson.toJson(mensagem));
    }
}