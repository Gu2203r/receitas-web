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
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ReceitaDAO dao = (ReceitaCsvDAO) getServletContext().getAttribute("daoReceita");

        List<Receita> listaReceitas = dao.listar();

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.addHeader("Access-Control-Allow-Origin", "*");

        PrintWriter pw = response.getWriter();
        pw.print(gson.toJson(listaReceitas));
    }

    @Override
    public void init() throws ServletException {
        // Dao de receitas inicial
        ReceitaDAO daoReceita = new ReceitaCsvDAO(getServletContext().getRealPath("/"));
        getServletContext().setAttribute("daoReceita", daoReceita);

        // Dao de usuarios inicial
        UsuarioDAO daoUsuario = new UsuarioCsvDAO(getServletContext().getRealPath("/"));
        getServletContext().setAttribute("daoUsuario", daoUsuario);

        System.out.println("Dados Carregados")  ;
    }

}