package br.edu.ifsp.controller;

import br.edu.ifsp.dao.AvaliacaoDAO;
import br.edu.ifsp.dao.UsuarioDAO;
import br.edu.ifsp.model.Avaliacao;
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

@WebServlet(name = "CadastroAvaliacaoServlet", value = "/avaliar")
public class CadastroAvaliacaoServlet extends HttpServlet {


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
        Usuario usuarioAtual = (Usuario) getServletContext().getAttribute("usuario");

        AvaliacaoDAO dao = (AvaliacaoDAO) getServletContext().getAttribute("daoAvaliacao");

        Avaliacao a = new Avaliacao();

        if(contentType.contains("application/json")){
            StringBuilder sb = new StringBuilder();
            BufferedReader br = request.getReader();

            String linha;

            while ((linha = br.readLine()) != null){
                sb.append(linha);
            }

            if (usuarioAtual != null){
                a = gson.fromJson(sb.toString(), Avaliacao.class);
                a.setAvaliador(usuarioAtual.getEmail());
            }

        }

        List<String> listaMensagens = new ArrayList<>();

        if (a.getAvaliador() == null || a.getAvaliador().isEmpty()){
            listaMensagens.add("Nome invalido");
            System.out.println("nome invalido");
        }

        if (a.getReceita() < 0){
            listaMensagens.add("Receita invalida");
            System.out.println("Receita invalida");
        }

        if (a.getNota() < 0 || a.getNota() > 5){
            listaMensagens.add("Nota invalida");
            System.out.println("Nota invalida");
        }


        Map<String, Object> mensagem = new HashMap<>();

        if (!listaMensagens.isEmpty()){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            System.out.println("Algum erro ocorreu ao avaliar receita");
            mensagem.put("mensagem", "Houve um problema");
            mensagem.put("problemas", listaMensagens);
        }else {

            dao.inserir(a);
            mensagem.put("mensagem", "Avaliação publicada com sucesso!");
            response.setStatus(HttpServletResponse.SC_OK);
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter pw = response.getWriter();

        pw.println(gson.toJson(mensagem));
    }
}