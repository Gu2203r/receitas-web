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

@WebServlet(name = "ExcluirUsuarioServlet", value = "/excluir_usuario")
public class ExcluirUsuarioServlet extends HttpServlet {

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
        String email;

        Usuario usuarioLogado = (Usuario) getServletContext().getAttribute("usuario");
        UsuarioDAO dao = (UsuarioDAO) getServletContext().getAttribute("daoUsuario");

        if(contentType.contains("application/json")){
            StringBuilder sb = new StringBuilder();
            BufferedReader br = request.getReader();

            String linha;

            while ((linha = br.readLine()) != null){
                sb.append(linha);
            }

            Usuario user = gson.fromJson(sb.toString(), Usuario.class);
            email = user.getEmail();

        }else {
            email = "";
        }

        Map<String, Object> mensagem = new HashMap<>();

        if (email.isEmpty() || dao.buscaPorLogin(email) == null || !usuarioLogado.getEmail().equals(email)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            System.out.println("Usuario nao tem permissao para realizar essa ação");
            mensagem.put("mensagem", "Usuario sem premissão");
        }else {
            dao.excluir(email);
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter pw = response.getWriter();

        pw.println(gson.toJson(mensagem));
    }
}