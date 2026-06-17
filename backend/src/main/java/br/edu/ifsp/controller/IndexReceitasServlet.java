package br.edu.ifsp.controller;

import br.edu.ifsp.dao.*;
import br.edu.ifsp.model.Receita;
import com.google.gson.Gson;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;
import java.util.stream.Collectors;

@WebServlet(name = "IndexReceitasServlet", value = "/iniciar")
public class IndexReceitasServlet extends HttpServlet {

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


        ReceitaDAO daoReceita = (ReceitaDAO) getServletContext().getAttribute("daoReceita");
        AvaliacaoDAO daoAvaliacao = (AvaliacaoDAO) getServletContext().getAttribute("daoAvaliacao");
        UsuarioDAO daoUsuario = (UsuarioDAO) getServletContext().getAttribute("daoUsuario");

        Map<String, Object> resultado = new HashMap<>();

        List<Receita> listaReceitas = daoReceita.listar();

        PrintWriter pw = response.getWriter();

        if (listaReceitas.isEmpty()) {
            resultado.put("mensagem", "Sem receitas cadastradas");
            response.setStatus(HttpServletResponse.SC_OK);
            pw.print(gson.toJson(resultado));
            return;
        }

        // ultima receita adicionada
        Receita ultimaReceita = listaReceitas.get(listaReceitas.size() - 1);
        resultado.put("novidade", ultimaReceita);


        // Ordena pela media retornada pelo DAO em ordem decrescente e limita a 3
        List<Receita> melhoresAvaliadas = listaReceitas.stream()
                .sorted(Comparator.comparingDouble(
                        (Receita r) -> daoAvaliacao.getMediaReceita(r.getId())
                ).reversed())
                .limit(3)
                .collect(Collectors.toList());

        resultado.put("melhoresAvaliadas", melhoresAvaliadas);

        // pega as 3 primeiras adicionadas

        int limite = Math.min(3, listaReceitas.size());
        List<Receita> listaPrimeiras = listaReceitas.subList(0, limite);

        resultado.put("primeirasAdicionadas", listaPrimeiras);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        response.setStatus(HttpServletResponse.SC_OK);
        pw.print(gson.toJson(resultado));
    }

    @Override
    public void init() throws ServletException {
        ReceitaDAO daoReceita = new ReceitaCsvDAO(getServletContext().getRealPath("/"));
        getServletContext().setAttribute("daoReceita", daoReceita);

        UsuarioDAO daoUsuario = new UsuarioCsvDAO(getServletContext().getRealPath("/"));
        getServletContext().setAttribute("daoUsuario", daoUsuario);

        AvaliacaoDAO avaliacaoDAO = new AvaliacaoCsvDAO(getServletContext().getRealPath("/"));
        getServletContext().setAttribute("daoAvaliacao", avaliacaoDAO);

        System.out.println("Dados Carregados");
    }
}