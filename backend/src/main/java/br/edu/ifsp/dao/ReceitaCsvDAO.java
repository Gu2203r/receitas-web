package br.edu.ifsp.dao;

import br.edu.ifsp.model.Categoria;
import br.edu.ifsp.model.Receita;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class ReceitaCsvDAO implements ReceitaDAO {

    private String path = null;
    private int proxId;

    public ReceitaCsvDAO(String path) {
        this.path = path + "Receita.csv";
        this.proxId = lastId();
    }

    @Override
    public Receita inserir(Receita receita) {

        try {
            checkFile();

            FileWriter fw = new FileWriter(path, true);
            PrintWriter pw = new PrintWriter(fw);

            receita.setId(getProxId());

            pw.println(receita);
            pw.close();
            fw.close();

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return receita;
    }

    @Override
    public List<Receita> listar() {
        List<Receita> listaReceita = new ArrayList<>();

        try {
            checkFile();
            FileReader fr = new FileReader(path);
            BufferedReader br = new BufferedReader(fr);

            String linha;

            while ((linha = br.readLine()) != null) {
                String[] partes = linha.split(";");
                Receita r = new Receita(
                        Integer.parseInt(partes[0]),
                        partes[1],
                        partes[2],
                        partes[3],
                        desescapar(partes[4]),   // ingredientes
                        desescapar(partes[5]),   // modoPreparo
                        Categoria.valueOf(partes[6]),
                        partes[7],
                        partes[8],
                        Integer.parseInt(partes[9])
                );
                listaReceita.add(r);
            }

            fr.close();
            br.close();

        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return listaReceita;
    }

    @Override
    public Receita buscarPorId(int id) {

        List<Receita> listaReceitas = listar();

        return listaReceitas.stream()
                .filter(r -> r.getId() == id)
                .findFirst()
                .orElse(null);
    }

    @Override
    public Receita atualizar(Receita receita) {

        Receita receitaExistente = buscarPorId(receita.getId());

        if (receitaExistente == null) {
            return null;
        }

        receitaExistente.setNome(receita.getNome());
        receitaExistente.setAutor(receita.getAutor());
        receitaExistente.setTempoPreparo(receita.getTempoPreparo());
        receitaExistente.setIngredientes(receita.getIngredientes());
        receitaExistente.setModoPreparo(receita.getModoPreparo());
        receitaExistente.setCategoria(receita.getCategoria());
        receitaExistente.setRendimento(receita.getRendimento());
        receitaExistente.setFoto(receita.getFoto());

        reescrever(receitaExistente, false);

        return receitaExistente;
    }

    @Override
    public boolean remover(int id) {

        Receita receita = buscarPorId(id);

        if (receita == null) {
            return false;
        }

        reescrever(receita, true);

        return true;
    }

    private int lastId() {
        List<Receita> lista = this.listar();
        return !lista.isEmpty() ? lista.get(lista.size() - 1).getId() : 0;
    }

    private int getProxId() {
        return ++this.proxId;
    }

    private void checkFile() {

        File file = new File(path);
        if (!file.exists()) {
            try {
                file.createNewFile();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    // Reescreve o CSV após uma edição ou remoção.
    // Se excluir=true, remove a receita da lista antes de reescrever.
    // Se excluir=false, substitui os dados da receita existente pelos novos.
    private void reescrever(Receita receita, boolean excluir) {

        List<Receita> listaReceitas = listar();

        if (excluir) {
            listaReceitas.removeIf(r -> r.getId() == receita.getId());
        } else {
            listaReceitas.stream()
                    .filter(r -> r.getId() == receita.getId())
                    .findFirst()
                    .ifPresent(r -> {
                        r.setNome(receita.getNome());
                        r.setTempoPreparo(receita.getTempoPreparo());
                        r.setIngredientes(receita.getIngredientes());
                        r.setModoPreparo(receita.getModoPreparo());
                        r.setCategoria(receita.getCategoria());
                        r.setRendimento(receita.getRendimento());
                        r.setFoto(receita.getFoto());
                    });
        }

        // Limpa o arquivo
        try (FileWriter writer = new FileWriter(path)) {
            writer.write("");
        } catch (IOException e) {
            throw new RuntimeException("Erro ao limpar o arquivo: " + e.getMessage());
        }

        // reescreve o arquivo sem usar o inserir() para preservar os ids originais
        try (FileWriter fw = new FileWriter(path, true);
             PrintWriter pw = new PrintWriter(fw)) {

            for (Receita r : listaReceitas) {
                pw.println(r);
            }

        } catch (IOException e) {
            throw new RuntimeException("Erro ao reescrever o arquivo: " + e.getMessage());
        }
    }

    // Para nao dar erro nas quebras de linhas
    private String desescapar(String texto) {
        if (texto == null) return "";
        return texto.replace("\\n", "\n");
    }
}