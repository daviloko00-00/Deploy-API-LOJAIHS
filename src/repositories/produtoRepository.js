import { connection } from "../configs/Database.js";

const produtoRepository = {
    criar: async (produto) => {
        const sql = "INSERT INTO produtos (IdCategoria, Nome, Valor, CaminhoImagem) VALUES (?,? ,? ,?)";
        const values = [produto.idCategoria ,produto.nome, produto.valor, produto.caminhoImagem]
        const [rows] = await connection.execute(sql, values)
        return rows

    },
    
    editar: async (produto) => {
        console.log(produto.idCategoria, produto.nome, produto.valor, produto.caminhoImagem, produto.id)
        const sql = "UPDATE produtos SET IdCategoria=?, Nome = ?, Valor=?, CaminhoImagem=? WHERE Id=?;";
        const values = [produto.idCategoria, produto.nome, produto.valor, produto.caminhoImagem, produto.id]
        const [rows] = await connection.execute(sql, values)
        return rows

    },
    selecionar: async () => {
        const sql = "SELECT * FROM produtos;";
        const [rows] = await connection.execute(sql)
        return rows

    },

    selecao_detalhada : async () => {
      const sql = 'SELECT p.Id AS ProdutoId,p.Nome AS ProdutoNome,p.Valor,p.CaminhoImagem,p.DataCad AS ProdutoDataCad,c.Id AS CategoriaId,c.Nome AS CategoriaNome,c.Descricao FROM produtos p INNER JOIN categorias c ON p.IdCategoria = c.Id';
      const [rows] = await connection.execute(sql)
        return rows
    },
    deletar: async (id) => {
        const sql = "DELETE FROM produtos WHERE Id = ?;";
        const values = [id]
        const [rows] = await connection.execute(sql, values)
        return rows

    }
}

export default produtoRepository;