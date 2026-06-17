package br.edu.ifsp.controller;

import br.edu.ifsp.dao.ImagemReceitaDAO;
import br.edu.ifsp.dao.ReceitaCsvDAO;
import br.edu.ifsp.dao.ReceitaDAO;
import br.edu.ifsp.model.Categoria;
import br.edu.ifsp.model.FuncaoUsuario;
import br.edu.ifsp.model.Receita;
import br.edu.ifsp.model.Usuario;
import com.google.gson.Gson;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

@WebServlet(name = "CadastroServlet", value = "/cadastrar_receita")
public class CadastroReceitaServlet extends HttpServlet {

    private final Gson gson = new Gson();


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

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
        request.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        String contentType = request.getContentType();
        List<String> listaMensagens = new ArrayList<>();
        Receita r;

        // pega o usuario que esta logado no momento (autor da receita)
        Usuario autor = (Usuario) getServletContext().getAttribute("usuario");

        if (contentType.contains("application/json")){
            StringBuilder sb = new StringBuilder();
            BufferedReader br = request.getReader();

            String linha;

            while ((linha = br.readLine()) != null){
                sb.append(linha);
            }

            if (autor != null){
                r = gson.fromJson(sb.toString(), Receita.class);
                r.setAutor(autor.getEmail());
            }else {
                r = new Receita();
            }


        }else {
            r = new Receita();
        }

        if (r.getNome() == null){
            listaMensagens.add("Nome invalido");
        }

        if (r.getTempoPreparo() == null){
            listaMensagens.add("Tempo de preparo invalido");
        }

        if (r.getIngredientes() == null){
            listaMensagens.add("Ingredientes invalidos");
        }

        if (r.getModoPreparo() == null){
            listaMensagens.add("Modo de preparo invalido");
        }

        if (r.getCategoria() == null){
            listaMensagens.add("Categoria invalida");
        }

        if (r.getRendimento() == null){
            listaMensagens.add("Rendimento invalido");
        }

//        if (r.getFoto() == null){
//            listaMensagens.add("Foto invalida");
//            System.out.println(r.getFoto());
//        }

        Map<String, Object> mensagem = new HashMap<>();


        if(autor != null && !listaMensagens.isEmpty()){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            mensagem.put("mensagem", "Houve um problema");
            mensagem.put("problemas", listaMensagens);
        } else if (autor == null || autor.getFuncao() != FuncaoUsuario.ADMIN) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            System.out.println("Usuario nao esta logado");
            mensagem.put("mensagem", "Acesso Negado, faça o login novamente");
        } else{
            ReceitaDAO dao = (ReceitaDAO) getServletContext().getAttribute("daoReceita");
            // salva o arquivo da foto e guarda o caminho no csv
            r.setFoto(ImagemReceitaDAO.salvarImagem(r.getFoto(), getServletContext().getRealPath("")));

            dao.inserir(r);
            response.setStatus(HttpServletResponse.SC_OK);
            mensagem.put("mensagem", "Registro inserido com sucesso");
        }


        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter pw = response.getWriter();

        pw.print(gson.toJson(mensagem));

    }

}