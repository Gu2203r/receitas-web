package br.edu.ifsp.controller;

import br.edu.ifsp.dao.ImagemReceitaDAO;
import br.edu.ifsp.dao.ReceitaDAO;
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

@WebServlet(name = "EditarReceitaServlet", value = "/editar_receita")
public class EditarReceitaServlet extends HttpServlet {

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

        List<String> listaMensagens = new ArrayList<>();
        Map<String, Object> mensagem = new HashMap<>();
        Receita r;

        StringBuilder sb = new StringBuilder();
        BufferedReader br = request.getReader();
        String linha;
        while ((linha = br.readLine()) != null) {
            sb.append(linha);
        }

        r = gson.fromJson(sb.toString(), Receita.class);

        // Validações dos campos obrigatórios
        if (r.getId() <= 0){
            listaMensagens.add("ID da receita inválido.");
        }
        if (r.getNome() == null){
            listaMensagens.add("Nome inválido.");
        }
        if (r.getTempoPreparo() == null){
            listaMensagens.add("Tempo de preparo inválido.");
        }
        if (r.getIngredientes() == null){
            listaMensagens.add("Ingredientes inválidos.");
        }
        if (r.getModoPreparo() == null){
            listaMensagens.add("Modo de preparo inválido.");
        }
        if (r.getCategoria() == null){
            listaMensagens.add("Categoria inválida.");
        }
        if (r.getRendimento() == null){
            listaMensagens.add("Rendimento inválido.");
        }

        if (!listaMensagens.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            mensagem.put("mensagem", "Houve um problema");
            mensagem.put("problemas", listaMensagens);

        } else if (getServletContext().getAttribute("usuario") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            mensagem.put("mensagem", "Acesso negado. Faça o login novamente.");

        } else {
            ReceitaDAO dao = (ReceitaDAO) getServletContext().getAttribute("daoReceita");

            // se o usuario enviou uma nova foto, salva e atualiza o caminho
            // caso contrario, mantém a foto que já está salva no banco
            if (r.getFoto() != null && !r.getFoto().isEmpty()) {
                String caminhoFoto = ImagemReceitaDAO.salvarImagem(r.getFoto(), getServletContext().getRealPath(""));
                r.setFoto(caminhoFoto);
            } else {
                Receita receitaAtual = dao.buscarPorId(r.getId());
                if (receitaAtual != null) {
                    r.setFoto(receitaAtual.getFoto());
                }
            }

            Receita atualizada = dao.atualizar(r);

            if (atualizada != null) {
                response.setStatus(HttpServletResponse.SC_OK);
                mensagem.put("mensagem", "Receita atualizada com sucesso!");
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                mensagem.put("mensagem", "Receita não encontrada para atualização.");
            }
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter pw = response.getWriter();
        pw.print(gson.toJson(mensagem));
    }
}