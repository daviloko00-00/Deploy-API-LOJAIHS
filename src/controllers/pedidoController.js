import pedidoRepository from "../repositories/pedidoRepository.js";
import { statusPedido } from "../enum/statusPedido.js";
import { Pedido } from "../models/Pedidos.js";
import { itemPedidos } from "../models/itensPedidos.js";
const pedidoController = {

    criar: async (req, res) => {
        try {
            let { clienteId, itens } = req.body;




            //  CRIA OBJETOS 
            console.log("criação dos itens")
            const itensPedido = itens.map(item =>
                itemPedidos.criar({
                    produtoId: item.produtoId,
                    quantidade: item.quantidade,
                    valorItem: item.valorItem
                })
            )
            console.log(itensPedido)

            const subtotalItens = itemPedidos.calcularSubTotal(itensPedido);
            //método pro calculo desse pedido
            // primeiro os itens e depois a cabaça do pedido
            const pedido = Pedido.criar({
                clienteId,
                subtotalItens,
                status: statusPedido.ABERTO
            });

            //  REPOSITORY 
            const result = await pedidoRepository.criar(
                pedido,
                itensPedido

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





    selecionar: async (req, res) => {
        try {
            const id = req.params.id ? Number(req.params.id) : null;

            if (id) {
                const pedido = await pedidoRepository.selecionarPorIdCompleto(id);
                return res.status(200).json(pedido);
            }

            const result = await pedidoRepository.selecionar();
            return res.status(200).json(result);

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Ocorreu um erro no servidor",
                errorMessage: error.message
            });
        }
    },

    adicionarItemPedido: async (req, res) => {
        try {
            const idPedido = Number(req.params.id);
            const { produtoId, quantidade, valorItem } = req.body;

            // CRIA OBJETO ITEM
            const novoItem = itemPedidos.criar({
                produtoId,
                quantidade,
                valorItem
            });

            // CALCULA SUBTOTAL DO ITEM
            const subtotalItem = itemPedidos.calcularSubTotal([novoItem]);

            // REPOSITORY
            const result = await pedidoRepository.adicionarItemPedido(idPedido, novoItem, subtotalItem);

            return res.status(200).json(result);

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro ao adicionar item no pedido",
                errorMessage: error.message
            });
        }
    },
    editarItemExistente: async (req, res) => {
        try {
            const { idPedido } = req.params;
            const { itemPedidoId, quantidade } = req.body;

            const pedido = new Pedido({ id: idPedido });
            const itemPedido = new itemPedidos({ itemPedidoId, quantidade });
            console.log("pedido", pedido, "item", itemPedido)
            const result = await pedidoRepository.editarItemExistente(pedido, itemPedido);

            return res.status(200).json(result);

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    atualizarStatus: async (req, res) => {
        try {
            const id = Number(req.body.id);
            const { status } = req.body;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }

            if (!status) {
                return res.status(400).json({ error: "Status é obrigatório" });
            }

            const pedidoAtual = await pedidoRepository.selecionarPorId(id);

            if (!pedidoAtual) {
                return res.status(404).json({ error: "Pedido não encontrado" });
            }

            const novoPedido = Pedido.editar({
                clienteId: pedidoAtual.ClienteId,
                subtotal: pedidoAtual.Subtotal,
                status: status,
                id: pedidoAtual.Id
            });

            const result = await pedidoRepository.atualizarStatus(id, status);

            return res.status(200).json({
                message: "Status atualizado com sucesso",
                pedido: novoPedido,
                result
            });

        } catch (error) {
            return res.status(500).json({
                error: "Erro ao atualizar status",
                details: error.message
            });
        }
    },

    deleteItemPedido: async (req, res) => {
    try {
        const idItem = Number(req.params.id);

        if (!idItem || isNaN(idItem)) {
            return res.status(400).json({ error: "ID do item inválido" });
        }

        const result = await pedidoRepository.deletarItemPed(idItem);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            error: "Erro ao deletar item do pedido",
            details: error.message
        });
    }
}
};

export default pedidoController;



