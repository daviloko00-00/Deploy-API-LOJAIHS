import { Categoria } from "../models/Categoria.js";
import categoriaRepository from "../repositories/categoriaRepository.js";

const categoriaController = {
    criar: async (req, res) => {
        try {
            const { nome, descricao } = req.body
            console.log(req.body);
            
            const categoria = Categoria.criar({ nome, descricao })
            const result = await categoriaRepository.criar(categoria)
            return res.status(201).json({ result })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Ocorreu um erro no servidor,", errorMessage: error.message })
        }
    },
    atualizar: async (req, res) => {
        try {
            const id = Number(req.query.id)
            const { nome, descricao } = req.body
            console.log("ID :",id)
            const categoria = Categoria.editar({ nome, descricao }, id)

            const result = await categoriaRepository.editar(categoria)
            return res.status(200).json({ result })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Ocorreu um erro no servidor,", errorMessage: error.message })
        }
    },
    deletar: async (req, res) => {
        try {
            const id = Number(req.params.id)
            const result = await categoriaRepository.deletar(id)
            return res.status(200).json({ result })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Ocorreu um erro no servidor,", errorMessage: error.message })
        }
    },
    selecionar: async (req, res) => {
        try {
            const result = await categoriaRepository.selecionar()
            return res.status(200).json({ result })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Ocorreu um erro no servidor,", errorMessage: error.message })
        }
    },
}

export default categoriaController