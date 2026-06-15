import clienteRepository from "../repositories/clienteRepository.js";
import axios from "axios";
import { validarCPF } from "../utils/validarCpf.js";
import { limparNumero } from "../utils/limparNumero.js";
import { Cliente } from "../models/Clientes.js";
import { Telefone } from "../models/Telefones.js";
import { Enderecos } from "../models/Enderecos.js";

const clienteController = {

    criar: async (req, res) => {
        try {
            let { nome, cpf, cep, numeroTelefone, numeroCasa } = req.body;

            //  VALIDAÇÃO BÁSICA 
            if (!nome || !cpf || !cep || !numeroTelefone || !numeroCasa) {
                return res.status(400).json({
                    message: "Todos os campos são obrigatórios"
                });
            }

            //  LIMPEZA 
            cpf = limparNumero(cpf);
            cep = limparNumero(cep);
            numeroTelefone = limparNumero(numeroTelefone);

            //  VALIDA CPF 
            if (!validarCPF(cpf)) {
                return res.status(400).json({ message: "CPF inválido" });
            }

            //  VIA CEP 
            const enderecoViaCep = await respostaViaCep(cep);

            if (!enderecoViaCep || enderecoViaCep.erro) {
                return res.status(400).json({ message: "CEP inválido" });
            }

            //  CRIA OBJETOS 
            const cliente = Cliente.criar({
                nome,
                cpf
            });
            

            const telefone = Telefone.criar({
                numero: numeroTelefone,
                
            });

            const endereco = Enderecos.criar({
                cep,
                logradouro: enderecoViaCep.logradouro,
                numero: numeroCasa,
                bairro: enderecoViaCep.bairro,
                cidade: enderecoViaCep.localidade,
                estado: enderecoViaCep.estado, 
                complemento: enderecoViaCep.complemento || null
                
            });

            // DEBUG 
            console.log("Cliente:", cliente);
            console.log("Telefone:", telefone);
            console.log("Endereço:", endereco);

            //  REPOSITORY 
            const result = await clienteRepository.criar(
                cliente,
                telefone,
                endereco
            );

            return res.status(201).json({ result });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Ocorreu um erro no servidor",
                errorMessage: error.message
            });
        }
    },

    atualizar: async (req, res) => {
    try {
        const id = Number(req.query.id);

        let {
            nome,
            cpf,
            numeroTelefone,
            numeroCasa,
            cep
        } = req.body;

        // Cliente obrigatório
        if (!id || !nome || !cpf) {
            return res.status(400).json({
                message: "ID, nome e CPF são obrigatórios"
            });
        }

        // Limpeza
        cpf = limparNumero(cpf);

        if (numeroTelefone) {
            numeroTelefone = limparNumero(numeroTelefone);
        }

        if (cep) {
            cep = limparNumero(cep);
        }

        // Validar CPF
        if (!validarCPF(cpf)) {
            return res.status(400).json({
                message: "CPF inválido"
            });
        }

        // Cliente obrigatório
        const cliente = Cliente.editar({
            nome,
            cpf
        }, id);

        // Telefone opcional
        const telefone = numeroTelefone
            ? Telefone.editar({
                numero: numeroTelefone
            }, id)
            : null;

        let endereco = null;

        // Endereço  usando ViaCEP
        if (cep && numeroCasa) {
            const enderecoViaCep = await respostaViaCep(cep);

            if (!enderecoViaCep || enderecoViaCep.erro) {
                return res.status(400).json({
                    message: "CEP inválido"
                });
            }

            endereco = Enderecos.editar({
                cep,
                logradouro: enderecoViaCep.logradouro,
                numero: numeroCasa,
                bairro: enderecoViaCep.bairro,
                cidade: enderecoViaCep.localidade,
                estado: enderecoViaCep.estado,
                complemento: enderecoViaCep.complemento || null
            }, id);
        }

        const result = await clienteRepository.atualizar(
            id,
            cliente,
            telefone,
            endereco
        );

        return res.status(200).json({ result });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Ocorreu um erro no servidor",
            errorMessage: error.message
        });
    }
},

    deletar: async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (!id) {
                return res.status(400).json({
                    message: "ID inválido"
                });
            }

            const result = await clienteRepository.deletar(id);

            return res.status(200).json({ result });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Ocorreu um erro no servidor",
                errorMessage: error.message
            });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await clienteRepository.selecionar();

            return res.status(200).json({ result });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Ocorreu um erro no servidor",
                errorMessage: error.message
            });
        }
    }
};

export default clienteController;



async function respostaViaCep(cep) {
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        return response.data;
    } catch (error) {
        return { erro: true };
    }
}