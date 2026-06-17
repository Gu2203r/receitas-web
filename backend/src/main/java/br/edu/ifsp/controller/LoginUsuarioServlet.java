package br.edu.ifsp.controller;

import br.edu.ifsp.dao.UsuarioDAO;
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

@WebServlet(name = "LoginUsuarioServlet", value = "/logar")
public class LoginUsuarioServlet extends HttpServlet {

    Gson gson = new Gson();

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

        UsuarioDAO usuarioDAO = (UsuarioDAO) getServletContext().getAttribute("daoUsuario");

        String contentType = request.getContentType();
        String email;
        String senha;

        if (contentType.contains("application/json")){
            StringBuilder sb = new StringBuilder();
            BufferedReader bw = request.getReader();

            String linha;

            while ((linha = bw.readLine()) != null){
                sb.append(linha);
            }

            Usuario u = gson.fromJson(sb.toString(), Usuario.class);

            email = u.getEmail();
            senha = u.getSenha();

            System.out.println(email);

            List<String> listaMensagens = new ArrayList<>();
            Usuario usuario = usuarioDAO.buscaPorLogin(email);

            if (usuario != null){

                if (usuario.getSenha().equals(senha)){
                    getServletContext().setAttribute("usuario", usuario);
                    System.out.println("usuario registrado na sessao");
                }else {
                    listaMensagens.add("Senha Invalida");
                }

            }else {
                listaMensagens.add("Email Invalido");
            }

            Map<String, Object> mensagem = new HashMap<>();

            if (!listaMensagens.isEmpty()){
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                mensagem.put("mensagem", "Houve um problema");
                mensagem.put("problemas", listaMensagens);
            }else {
                response.setStatus(HttpServletResponse.SC_OK);
                mensagem.put("mensagem", "login efetuado com sucesso");
                mensagem.put("usuario", usuario);
            }

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            PrintWriter pw = response.getWriter();
            System.out.println(mensagem);
            pw.println(gson.toJson(mensagem));

        }

    }
}