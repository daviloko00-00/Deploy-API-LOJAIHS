import { Produto } from "../models/Produtos.js";
import produtoRepository from "../repositories/produtoRepository.js";
import os from "os";

function obterIpLocal() {
  const interfaces = os.networkInterfaces();
  
  for (const nomeInterface in interfaces) {
    for (const rede of interfaces[nomeInterface]) {
      // Filtra para pegar apenas IPv4 e que não seja o IP de loopback (127.0.0.1)
      if (rede.family === 'IPv4' && !rede.internal) {
        return rede.address;
      }
    }
  }



  return 'IP local não encontrado';
}


const ipLocal = obterIpLocal();

const produtoController = {

    upload: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'Arquivo não encontrado' });
            }

            return res.status(200).json({
                file: {
                    filename: req.file.filename,
                    size: req.file.size,
                    mimetype: req.file.mimetype
                }
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Ocorreu um erro no servidor,",
                errorMessage: error.message
            });
        }
    },

    criar: async (req, res) => {
        try {
            const { nome, valor, idCategoria } = req.body;

            const baseUrl = `${req.protocol}://${req.get("host")}`;

            const caminhoImagem = req.file
                ? `${baseUrl}/uploads/images/${req.file.filename}`
                : null;

            const produto = Produto.criar({
                nome,
                valor,
                idCategoria,
                caminhoImagem
            });

            const result = await produtoRepository.criar(produto);

            return res.status(201).json({ result });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Erro no servidor",
                errorMessage: error.message
            });
        }
    },


    atualizar: async (req, res) => {
        try {
            const { nome, valor, idCategoria } = req.body;
            const id = Number(req.query.id);

            if (!id || isNaN(id)) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const valorNumerico = valor ? Number(valor) : undefined;
            if (valor && isNaN(valorNumerico)) {
                return res.status(400).json({ message: "Valor inválido" });
            }
            const caminhoImagem = req.file ? req.file.filename : undefined;

            const caminhoComhttp = `http://${ipLocal}:8080/uploads/images/${caminhoImagem}`

            const produto = Produto.editar({
                nome,
                valor: valorNumerico,
                idCategoria,
                caminhoImagem : caminhoComhttp
            }, id);

            const result = await produtoRepository.editar(produto);

            return res.status(200).json({ result });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Ocorreu um erro no servidor",
                errorMessage: error.message
            });
        }
    },
    deletar: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const result = await produtoRepository.deletar(id);
            return res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Ocorreu um erro no servidor,",
                errorMessage: error.message
            });
        }
    },
    selecionar: async (req, res) => {
        try {
            const result = await produtoRepository.selecionar();
            return res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Ocorreu um erro no servidor,",
                errorMessage: error.message
            });
        }
    },
    selecao_detalhada: async (req, res) => {
        try {
            const result = await produtoRepository.selecao_detalhada();
            return res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Ocorreu um erro no servidor,",
                errorMessage: error.message
            });
        }

    }
};

export default produtoController;