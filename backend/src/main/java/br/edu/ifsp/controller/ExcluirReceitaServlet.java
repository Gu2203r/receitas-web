package br.edu.ifsp.controller;

import br.edu.ifsp.dao.ImagemReceitaDAO;
import br.edu.ifsp.dao.ReceitaDAO;
import br.edu.ifsp.model.FuncaoUsuario;
import br.edu.ifsp.model.Receita;
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

@WebServlet(name = "ExcluirReceitaServlet", value = "/excluir_receita")
public class ExcluirReceitaServlet extends HttpServlet {

    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // code
    }

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

        Map<String, Object> mensagem = new HashMap<>();
        Receita r;

        StringBuilder sb = new StringBuilder();
        BufferedReader br = request.getReader();
        String linha;
        while ((linha = br.readLine()) != null) {
            sb.append(linha);
        }

        r = gson.fromJson(sb.toString(), Receita.class);

        int id = 0;
        if (r != null){
            id = r.getId();
        }

        Usuario u = (Usuario) getServletContext().getAttribute("usuario");

        if (u == null || u.getFuncao() != FuncaoUsuario.ADMIN) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            mensagem.put("mensagem", "Acesso negado. Faça o login novamente.");

        } else {
            ReceitaDAO dao = (ReceitaDAO) getServletContext().getAttribute("daoReceita");

            boolean excluida = dao.remover(id);

            if (excluida) {
                response.setStatus(HttpServletResponse.SC_OK);
                mensagem.put("mensagem", "Receita removida com sucesso!");
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                mensagem.put("mensagem", "Receita não encontrada.");
            }
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter pw = response.getWriter();
        pw.print(gson.toJson(mensagem));
    }
}