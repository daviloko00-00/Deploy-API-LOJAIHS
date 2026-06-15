import { connection } from "../configs/Database.js";
import { Pedido } from "../models/Pedidos.js";

const pedidoRepository = {
    criar: async (pedido, itemPedidos) => {
        const conn = await connection.getConnection();
        console.log(pedido)
        try {
            await conn.beginTransaction();

            // Inserir pedido
            const sqlPedido = "INSERT INTO pedidos (ClienteId, Subtotal, Status) VALUES (?, ?, ?)";
            const valuesPedido = [pedido.clienteId, pedido.subtotal, pedido.status];
            const [rowsPedido] = await conn.execute(sqlPedido, valuesPedido);

            const idpedido = rowsPedido.insertId;

            console.log("Itens recebidos:", itemPedidos);
            // Inserir itemPedidos
            itemPedidos.forEach(async element => {
                console.log("Inserindo item:", element.produtoId);
                const sqlItemPedidos = "INSERT INTO itemPedidos (PedidoId, ProdutoId, Quantidade, ValorItem) VALUES (?, ?, ?, ?)";
                const valuesItemPedidos = [rowsPedido.insertId, element.produtoId, element.quantidade, element.valorItem];
                await conn.execute(sqlItemPedidos, valuesItemPedidos);
            })



            await conn.commit();

            return {
                idpedido,
                rowsPedido,
            };

        } catch (error) {
            await conn.rollback();
            throw new Error(error.message);

        } finally {
            conn.release();
        }
    },

    selecionar: async () => {
        const sql = "SELECT * FROM pedidos";
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarPorIdCompleto: async (idPedido) => {
        const sql = `
    SELECT 
        -- Pedido
        p.Id AS PedidoId,
        p.SubTotal,
        p.Status,
        p.DataCad AS PedidoData,

        -- Cliente
        c.Id AS ClienteId,
        c.Nome AS ClienteNome,
        c.Cpf AS ClienteCpf,

        -- Itens
        ip.Id AS ItemPedidoId,
        ip.Quantidade,
        ip.ValorItem,

        -- Produto
        pr.Nome AS ProdutoNome,
        pr.Valor AS ProdutoValor,

        -- Categoria
        cat.Id AS CategoriaId,
        cat.Nome AS CategoriaNome,
        cat.Descricao AS CategoriaDescricao

    FROM pedidos p
    INNER JOIN clientes c ON c.Id = p.ClienteId
    INNER JOIN itempedidos ip ON ip.PedidoId = p.Id
    INNER JOIN produtos pr ON pr.Id = ip.ProdutoId
    INNER JOIN categorias cat ON cat.Id = pr.IdCategoria
    WHERE p.Id = ?
    `;

        const [rows] = await connection.execute(sql, [idPedido]);

        if (rows.length === 0) {
            return { message: "Pedido não encontrado" };
        }

        // Montar objeto estruturado
        const pedido = {
            cliente: {
                idCliente: rows[0].ClienteId,
                nome: rows[0].ClienteNome,
                cpf: rows[0].ClienteCpf
            },
            pedido: {
                id: rows[0].PedidoId,
                subtotal: rows[0].SubTotal,
                status: rows[0].Status,
                data: rows[0].PedidoData,
            },

            itens: rows.map(r => ({
                idItem: r.ItemPedidoId,
                quantidade: r.Quantidade,
                valorItem: r.ValorItem,

                produto: {
                    nome: r.ProdutoNome,
                    valor: r.ProdutoValor,
                    categoria: {
                        id: r.CategoriaId,
                        nome: r.CategoriaNome,
                        descricao: r.CategoriaDescricao
                    }
                }
            }))
        };

        return pedido;
    },
    
    adicionarItemPedido: async (idPedido, item) => {
    const conn = await connection.getConnection();

    try {
        await conn.beginTransaction();

        // Verificar se o pedido existe
        const [pedidoRows] = await conn.execute(
            "SELECT Id FROM pedidos WHERE Id = ?",
            [idPedido]
        );

        if (pedidoRows.length === 0) {
            throw new Error("Pedido não encontrado");
        }

        // Inserir novo item no pedido
        await conn.execute(
            `INSERT INTO itempedidos (PedidoId, ProdutoId, Quantidade, ValorItem)
             VALUES (?, ?, ?, ?)`,
            [idPedido, item.produtoId, item.quantidade, item.valorItem]
        );

        // Recalcular subtotal
        const [subtotalRows] = await conn.execute(
            `SELECT SUM(Quantidade * ValorItem) AS subtotal
             FROM itempedidos
             WHERE PedidoId = ?`,
            [idPedido]
        );

        const novoSubtotal = subtotalRows[0].subtotal ?? 0;

        // Atualizar subtotal no pedido
        await conn.execute(
            "UPDATE pedidos SET SubTotal = ? WHERE Id = ?",
            [novoSubtotal, idPedido]
        );

        await conn.commit();

        return {
            message: "Item adicionado com sucesso",
            novoSubtotal
        };

    } catch (error) {
        await conn.rollback();
        throw new Error(error.message);

    } finally {
        conn.release();
    }
},
     async editarItemExistente(pedido, itemPedido) {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            // verificar se pedido existe
            const [pedidoRows] = await conn.execute(
                "SELECT Id FROM pedidos WHERE Id = ?",
                [pedido.id]
            );

            if (pedidoRows.length === 0) {
                throw new Error("Pedido não encontrado");
            }

            // verificar se item existe no pedido
            const [itemRows] = await conn.execute(
                "SELECT Id FROM itempedidos WHERE Id = ? AND PedidoId = ?",
                [itemPedido.itemPedidoId, pedido.id]
            );

            if (itemRows.length === 0) {
                throw new Error("Item do pedido não encontrado");
            }

            // atualizar item
            await conn.execute(
                `UPDATE itempedidos 
                 SET Quantidade = ?
                 WHERE Id = ? AND PedidoId = ?`,
                [itemPedido.quantidade, itemPedido.itemPedidoId, pedido.id]
            );

            // recalcular subtotal
            const [subtotalRows] = await conn.execute(
                `SELECT SUM(Quantidade * ValorItem) AS subtotal
                 FROM itempedidos
                 WHERE PedidoId = ?`,
                [pedido.id]
            );

            const novoSubtotal = subtotalRows[0].subtotal ?? 0;

            // atualizar subtotal no objeto Pedido
            pedido.subTotal = novoSubtotal;

            // atualizar subtotal no banco
            await conn.execute(
                "UPDATE pedidos SET SubTotal = ? WHERE Id = ?",
                [pedido.subTotal, pedido.id]
            );

            await conn.commit();

            return {
                message: "Item atualizado com sucesso",
                pedidoId: pedido.id,
                novoSubtotal: pedido.subTotal
            };

        } catch (error) {
            await conn.rollback();
            throw new Error(error.message);

        } finally {
            conn.release();
        }
    },

    editarStatusPedido : async (pedidos, id) => {

        const conn = await connection.getConnection();

        try {

            const [rowsPedido] = await conn.execute(
                "SELECT Id FROM pedidos WHERE Id = ?",
                [id]
            );

            if (rowsPedido.length === 0) {
                throw new Error("Pedido não encontrado");
            }

            if (pedidos === ' ' || !pedidos){
                throw new Error("Status para pedido não aceito");

            }

            const [updateStatus] = await conn.execute(
                "UPDATE pedidos SET Status =? FROM pedidos WHERE Id = ?"
            , [pedidos.Status, id])

            conn.commit();

            return {updateStatus}
            
        } catch (error) {
            await conn.rollback();
            throw new Error(error.message);
        } finally {
            conn.release();
        }  
    },

    selecionarPorId: async (id) => {
    const sql = "SELECT * FROM pedidos WHERE Id = ?";
    const [rows] = await connection.execute(sql, [id]);

    return rows[0];
},

atualizarStatus: async (id, status) => {
    const conn = await connection.getConnection();

    const [result] = await conn.execute(
        "UPDATE pedidos SET Status = ? WHERE Id = ?",
        [status, id]
    );

    return result;
},

deletarItemPed: async (idItem) => {
    const conn = await connection.getConnection();

    try {
        await conn.beginTransaction();

        // 1 - Buscar o item antes de excluir
        const [itemRows] = await conn.execute(
            "SELECT PedidoId FROM itempedidos WHERE Id = ?",
            [idItem]
        );

        if (itemRows.length === 0) {
            throw new Error("Item não encontrado");
        }

        const pedidoId = itemRows[0].PedidoId;

        // 2 - Excluir item
        await conn.execute(
            "DELETE FROM itempedidos WHERE Id = ?",
            [idItem]
        );

        // 3 - Recalcular subtotal do pedido
        const [subtotalRows] = await conn.execute(
            //IFNULL é pra evitar erro quando não existir nenhum item no pedido.
            "SELECT IFNULL(SUM(Quantidade * ValorItem), 0) AS subtotal FROM itempedidos WHERE PedidoId = ?",
            [pedidoId]
        );

        const novoSubtotal = subtotalRows[0].subtotal;

        // 4 - Atualizar subtotal na tabela pedidos
        await conn.execute(
            "UPDATE pedidos SET Subtotal = ? WHERE Id = ?",
            [novoSubtotal, pedidoId]
        );

        await conn.commit();

        return {
            message: "Item deletado e subtotal atualizado",
            pedidoId,
            novoSubtotal
        };

    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}
};

export default pedidoRepository;