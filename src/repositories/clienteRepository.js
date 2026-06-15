import { connection } from "../configs/Database.js";

const clienteRepository = {
    criar: async (cliente, telefone, endereco) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            // Inserir cliente
            const sqlCli = "INSERT INTO clientes (Nome, Cpf) VALUES (?, ?)";
            const valuesCli = [cliente.nome, cliente.cpf];
            const [rowsCli] = await conn.execute(sqlCli, valuesCli);

            const idCliente = rowsCli.insertId;

            // Inserir telefone
            const sqlTel = "INSERT INTO telefones (IdCliente, Numero) VALUES (?, ?)";
            const valuesTel = [idCliente, telefone.numero];
            const [rowsTel] = await conn.execute(sqlTel, valuesTel);

            // Inserir endereço
            const sqlEnd = `
                INSERT INTO enderecos 
                (IdCliente, Cep, Logradouro, Numero, Bairro, Cidade, Estado, Complemento) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const valuesEnd = [
                idCliente,
                endereco.cep,
                endereco.logradouro,
                endereco.numero,
                endereco.bairro,
                endereco.cidade,
                endereco.estado,
                endereco.complemento ?? null
            ];

            const [rowsEnd] = await conn.execute(sqlEnd, valuesEnd);

            await conn.commit();

            return {
                idCliente,
                rowsCli,
                rowsTel,
                rowsEnd
            };

        } catch (error) {
            await conn.rollback();
            throw new Error(error.message);

        } finally {
            conn.release();
        }
    },

    selecionar: async () => {
        const sql = "SELECT * FROM clientes";
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarPorId: async (id) => {
        const sql = "SELECT * FROM clientes WHERE IdCliente = ?";
        const [rows] = await connection.execute(sql, [id]);
        return rows[0];
    },

    atualizar: async (id, cliente, telefone, endereco) => {
    const conn = await connection.getConnection();

    try {
        await conn.beginTransaction();

        // Atualizar cliente (obrigatório)
        const sqlCli = `
            UPDATE clientes
            SET Nome = ?, Cpf = ?
            WHERE Id = ?
        `;

        const valuesCli = [
            cliente.nome,
            cliente.cpf,
            id
        ];

        const [rowsCli] = await conn.execute(sqlCli, valuesCli);

        let rowsTel = null;
        let rowsEnd = null;

        // Atualizar telefone (opcional)
        if (telefone) {
            const sqlTel = `
                UPDATE telefones
                SET Numero = ?
                WHERE IdCliente = ?
            `;

            const valuesTel = [
                telefone.numero,
                id
            ];

            [rowsTel] = await conn.execute(sqlTel, valuesTel);
        }

        // Atualizar endereço (opcional)
        if (endereco) {
            const sqlEnd = `
                UPDATE enderecos
                SET Cep = ?, Logradouro = ?, Numero = ?, Bairro = ?,
                    Cidade = ?, Estado = ?, Complemento = ?
                WHERE IdCliente = ?
            `;

            const valuesEnd = [
                endereco.cep,
                endereco.logradouro,
                endereco.numero,
                endereco.bairro,
                endereco.cidade,
                endereco.estado,
                endereco.complemento ?? null,
                id
            ];

            [rowsEnd] = await conn.execute(sqlEnd, valuesEnd);
        }

        await conn.commit();

        return {
            idCliente: id,
            rowsCli,
            rowsTel,
            rowsEnd
        };

    } catch (error) {
        await conn.rollback();
        throw new Error(error.message);
    }
},

    deletar: async (id) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            await conn.execute(
                "DELETE FROM telefones WHERE IdCliente = ?",
                [id]
            );

            await conn.execute(
                "DELETE FROM enderecos WHERE IdCliente = ?",
                [id]
            );

            const [result] = await conn.execute(
                "DELETE FROM clientes WHERE Id = ?",
                [id]
            );

            await conn.commit();

            return result;

        } catch (error) {
            await conn.rollback();
            throw new Error(error.message);

        } finally {
            conn.release();
        }
    }
};

export default clienteRepository;