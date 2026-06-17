package br.edu.ifsp.controller;

import br.edu.ifsp.dao.ReceitaDAO;
import br.edu.ifsp.dao.UsuarioDAO;
import br.edu.ifsp.model.Receita;
import com.google.gson.Gson;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "DetalhesReceitaServlet", value = "/detalhes_receita")
public class DetalhesReceitaServlet extends HttpServlet {

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
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        int id = Integer.parseInt(request.getParameter("id"));

        ReceitaDAO receitaDAO = (ReceitaDAO) getServletContext().getAttribute("daoReceita");
        UsuarioDAO usuarioDAO = (UsuarioDAO) getServletContext().getAttribute("daoUsuario");

        Receita receita = receitaDAO.buscarPorId(id);
        receita.adicionarVisualizacao();

        if (receita != null){
            String nomeAutor = usuarioDAO.buscaPorLogin(receita.getAutor()).getNome();
            receita.setAutor(nomeAutor);
            response.setStatus(HttpServletResponse.SC_OK);
        }else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.addHeader("Access-Control-Allow-Origin", "*");

        PrintWriter pw = response.getWriter();
        pw.print(gson.toJson(receita));

    }

}