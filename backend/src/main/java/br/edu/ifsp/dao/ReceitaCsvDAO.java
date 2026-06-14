package br.edu.ifsp.dao;

import br.edu.ifsp.model.Receita;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class ReceitaCsvDAO implements ReceitaDAO{

    private String path = null;
    private int proxId;

    public ReceitaCsvDAO(String path){
        this.path = path + "Receita.csv";
        this.proxId = lastId();
    }

    @Override
    public Receita inserir(Receita receita) {

        try {
            checkFile();

            FileWriter fw = new FileWriter(path,true);
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

            while ((linha = br.readLine()) != null){
                String[] partes =linha.split(";");
//                Receita r = new Receita(Integer.parseInt(partes[0]), partes[1], partes[2]);

//                listaReceita.add(r);
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

    private int lastId(){
        List<Receita> lista = this.listar();
        return !lista.isEmpty() ? lista.get(lista.size()-1).getId() : 0;
    }

    private int getProxId(){
        return ++this.proxId;
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
}
