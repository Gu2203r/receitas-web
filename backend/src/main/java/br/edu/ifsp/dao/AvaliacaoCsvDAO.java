package br.edu.ifsp.dao;

import br.edu.ifsp.model.Avaliacao;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class AvaliacaoCsvDAO implements AvaliacaoDAO{

    private String path = null;

    public AvaliacaoCsvDAO(String path){
        this.path = path + "Avalicao.csv";
    }

    @Override
    public Avaliacao inserir(Avaliacao avaliacao) {

        try {
            checkFile();

            FileWriter fw = new FileWriter(path, true);
            PrintWriter pw = new PrintWriter(fw);

            pw.println(avaliacao);

            pw.close();
            fw.close();

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return avaliacao;
    }

    @Override
    public List<Avaliacao> listar() {
        List<Avaliacao> listaAvaliacoes = new ArrayList<>();

        try {
            checkFile();

            FileReader fr = new FileReader(path);
            BufferedReader br = new BufferedReader(fr);

            String linha;

            while ((linha = br.readLine()) != null){
                String[] partes = linha.split(";");

                Avaliacao a = new Avaliacao(partes[0], Integer.parseInt(partes[1]), Double.parseDouble(partes[2]), desescapar(partes[3]));

                listaAvaliacoes.add(a);
            }

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return listaAvaliacoes;
    }

    @Override
    public List<Avaliacao> buscarPorReceita(int idReceita) {
        List<Avaliacao> listaAvaliacoes = listar();

        return listaAvaliacoes.stream()
                .filter(avaliacao -> avaliacao.getReceita() == idReceita)
                .collect(Collectors.toList());

    }

    @Override
    public double getMediaReceita(int idReceita) {
        List<Avaliacao> listaAvaliacoes = buscarPorReceita(idReceita);

        return listaAvaliacoes.stream()
                .mapToDouble(Avaliacao::getNota)
                .average()
                .orElse(0.0);
    }

    private void checkFile(){

        File file = new File(path);
        if(!file.exists()){
            try {
                file.createNewFile();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    // Para nao dar erro nas quebras de linhas
    private String desescapar(String texto) {
        if (texto == null) return "";
        return texto.replace("\\n", "\n");
    }
}
