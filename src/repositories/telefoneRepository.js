import { connection } from "../configs/Database.js";

const telefoneRepository = {
    criar : async (telefone) => {
        const sql = "INSERT INTO telefones (IdCliente, Numero) VALUES (?,?)";
        const values = [telefone.idCliente, telefone.numero]
         

        const [rows] = await connection.execute(sql, values)
        return rows
        
    },
    selecionar : async () => {
        const sql = "SELECT * FROM telefones"
        const [rows] = await connection.execute(sql);
        return rows
    },
    deletar: async (id) => {
        const sql = "DELETE FROM telefones WHERE IdCliente = ?;";
        const values = [id]
        const [rows] = await connection.execute(sql, values)
        return rows

    },
    editar: async (telefones) => {
        console.log(telefones.idCliente, telefones.nume, telefones.id)
        const sql = "UPDATE telefones SET IdCliente=?, Numero = ? WHERE Id=?;";
        const values = [telefones.idCliente, telefones.numero, telefones.id]
        const [rows] = await connection.execute(sql, values)
        return rows

    },

}
export default telefoneRepository