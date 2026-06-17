package br.edu.ifsp.controller;

import br.edu.ifsp.dao.ReceitaDAO;
import br.edu.ifsp.model.Receita;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

@WebServlet(name = "ImagemReceitaServlet", value = "/imagem_receita")
public class ImagemReceitaServlet extends HttpServlet {

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

        // Valida o ID
        String idParam = request.getParameter("id");
        if (idParam == null || idParam.isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Parâmetro ID é obrigatório.");
            System.out.println("sem id");
            return;
        }

        int id;
        try {
            id = Integer.parseInt(idParam);
        } catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID em formato inválido.");
            System.out.println("sem id correto");
            return;
        }

        ReceitaDAO dao = (ReceitaDAO) getServletContext().getAttribute("daoReceita");

        // Valida se a receita existe no banco de dados
        Receita receita = dao.buscarPorId(id);
        if (receita == null || receita.getFoto() == null || receita.getFoto().isEmpty()) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Receita ou foto não encontrada no banco.");
            System.out.println("Arquivo nao existe no banco");
            return;
        }

        // 4. Monta o caminho de forma segura adicionando o File.separator
        String pastaImagens = getServletContext().getRealPath("") +
                File.separator + receita.getFoto();

        File arquivoImagem = new File(pastaImagens);

        // 5. Verifica se a imagem existe fisicamente no disco
        if (!arquivoImagem.exists()) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Arquivo não encontrado no servidor.");
            System.out.println("Arquivo nao existe");
            return;
        }

        // 6. Configura os Headers da Resposta
        String mimeType = getServletContext().getMimeType(arquivoImagem.getName());
        if (mimeType == null) {
            mimeType = "application/octet-stream";
        }
        response.setContentType(mimeType);
        response.setContentLength((int) arquivoImagem.length());

        // 7. Retorna os bytes da imagem
        try (FileInputStream in = new FileInputStream(arquivoImagem);
             OutputStream out = response.getOutputStream()) {

            byte[] buffer = new byte[4096];
            int bytesLidos;
            response.setStatus(HttpServletResponse.SC_OK);
            while ((bytesLidos = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesLidos);
            }
        }
    }
}
