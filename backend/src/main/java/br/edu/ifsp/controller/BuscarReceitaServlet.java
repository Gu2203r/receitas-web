package br.edu.ifsp.controller;

import br.edu.ifsp.dao.ReceitaDAO;
import br.edu.ifsp.model.Receita;

import com.google.gson.Gson;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.stream.Collectors;

@WebServlet(name = "BuscarReceitaServlet", value = "/buscar_receita")
public class BuscarReceitaServlet extends HttpServlet {

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
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String nomeBusca = request.getParameter("nome");

        ReceitaDAO daoReceita = (ReceitaDAO) getServletContext().getAttribute("daoReceita");
        List<Receita> listaReceitas = daoReceita.listar();

        List<Receita> resultado;

        if (nomeBusca == null || nomeBusca.trim().isEmpty()) {
            resultado = listaReceitas;
        } else {
            String termo = nomeBusca.trim().toLowerCase();

            resultado = listaReceitas.stream()
                    .filter(r -> r.getNome() != null && r.getNome().toLowerCase().contains(termo))
                    .collect(Collectors.toList());
        }

        response.setStatus(HttpServletResponse.SC_OK);

        PrintWriter pw = response.getWriter();
        pw.print(gson.toJson(resultado));
    }
}