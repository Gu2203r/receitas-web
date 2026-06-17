package br.edu.ifsp.controller;

import br.edu.ifsp.dao.ReceitaCsvDAO;
import br.edu.ifsp.dao.ReceitaDAO;
import br.edu.ifsp.dao.UsuarioCsvDAO;
import br.edu.ifsp.dao.UsuarioDAO;
import br.edu.ifsp.model.Receita;
import com.google.gson.Gson;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet(name = "ListarServlet", value = "/listar")
public class ListarReceitaServlet extends HttpServlet {

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
        ReceitaDAO dao = (ReceitaCsvDAO) getServletContext().getAttribute("daoReceita");
        UsuarioDAO daoUsuario = (UsuarioDAO) getServletContext().getAttribute("daoUsuario");

        List<Receita> listaReceitas = dao.listar();
        listaReceitas.forEach(receita -> receita.setAutor(daoUsuario.buscaPorLogin(receita.getAutor()).getNome()));

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.addHeader("Access-Control-Allow-Origin", "*");

        PrintWriter pw = response.getWriter();
        pw.print(gson.toJson(listaReceitas));
    }


}