package br.edu.ifsp.dao;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

public class ImagemReceitaDAO {

    public static String salvarImagem(String base64, String path){
        try {


            // decodifica a string Base64 para um array de bytes
            byte[] imageBytes = Base64.getDecoder().decode(base64);

            // cria uma pasta "imagens_receitas" dentro da pasta base
            String uploadPath = path + File.separator + "imagens_receitas";
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdir(); // Cria a pasta se não existir
            }

            // gera um nome de arquivo unico usando o UUID
            String nomeArquivo = UUID.randomUUID().toString() + ".jpg";
            String caminhoCompleto = uploadPath + File.separator + nomeArquivo;

            // salva o arquivo no disco do servidor
            Files.write(Paths.get(caminhoCompleto), imageBytes);


            return "imagens_receitas/" + nomeArquivo;

        } catch (IllegalArgumentException e) {
            System.out.println("A imagem enviada é inválida ou está corrompida.");
        } catch (IOException e) {
            System.out.println("Erro ao salvar a imagem no servidor: " + e.getMessage());
        }

        return null;
    }
}
