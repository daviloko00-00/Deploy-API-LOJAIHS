import mysql from 'mysql2/promise';
import dotenv from 'dotenv';


// Singleton para a conexão com o banco de dados
class Database {
    static #instance = null;
    #pool = null;


    #createPool() {
        this.#pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
            waitForConnections: true,
            connectionLimit: 100,
            queueLimit: 0,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }


    static getInstance() {
        if (!Database.#instance) {
            Database.#instance = new Database();
            Database.#instance.#createPool();
        }
        return Database.#instance;
    }


    getPool() {
        return this.#pool;
    }
}


export const connection = Database.getInstance().getPool();


export async function initializeDatabase() {
    console.log("Inicializando o banco de dados e tabelas...");
    try {
        const tempConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            ssl: { rejectUnauthorized: false }
        });


        const dbName = process.env.DB_DATABASE || 'deploy';


        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await tempConnection.query(`USE \`${dbName}\`;`);

        //categorias
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS categorias (
                Id INT NOT NULL AUTO_INCREMENT,
                Nome VARCHAR(45) NOT NULL,
                Descricao VARCHAR(100) NULL DEFAULT NULL,
                DataCad TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (Id))
                ENGINE = InnoDB
                AUTO_INCREMENT = 7
                DEFAULT CHARACTER SET = utf8mb4
                COLLATE = utf8mb4_0900_ai_ci;
        `);
        //clientes
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS clientes (
                Id INT NOT NULL AUTO_INCREMENT,
                Nome VARCHAR(100) NOT NULL,
                Cpf CHAR(11) NOT NULL,
                DataCad TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (Id),
                UNIQUE INDEX Cpf (Cpf ASC) VISIBLE)
                ENGINE = InnoDB
                AUTO_INCREMENT = 28
                DEFAULT CHARACTER SET = utf8mb4
                COLLATE = utf8mb4_0900_ai_ci;`)
        //endereços
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS enderecos (
                Id INT NOT NULL AUTO_INCREMENT,
                IdCliente INT NOT NULL,
                Cep CHAR(8) NOT NULL,
                Logradouro VARCHAR(100) NOT NULL,
                Numero VARCHAR(10) NOT NULL,
                Bairro VARCHAR(50) NOT NULL,
                Cidade VARCHAR(50) NOT NULL,
                Estado CHAR(100) NOT NULL,
                Complemento VARCHAR(100) NULL DEFAULT NULL,
                DataCad TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (Id),
                INDEX IdCliente (IdCliente ASC) VISIBLE,
                CONSTRAINT enderecos_ibfk_1
                    FOREIGN KEY (IdCliente)
                    REFERENCES loja_ihs.clientes (Id)
                    ON DELETE RESTRICT
                    ON UPDATE CASCADE)
                ENGINE = InnoDB
                AUTO_INCREMENT = 10
                DEFAULT CHARACTER SET = utf8mb4
                COLLATE = utf8mb4_0900_ai_ci;`)

        //produtos
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS loja_ihs.produtos (
                Id INT NOT NULL AUTO_INCREMENT,
                IdCategoria INT NOT NULL,
                Nome VARCHAR(100) NOT NULL,
                Valor DECIMAL(10,2) NOT NULL,
                CaminhoImagem VARCHAR(255) NULL DEFAULT NULL,
                DataCad TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (Id),
                INDEX IdCategoria (IdCategoria ASC) VISIBLE,
                CONSTRAINT produtos_ibfk_1
                    FOREIGN KEY (IdCategoria)
                    REFERENCES loja_ihs.categorias (Id)
                    ON DELETE RESTRICT
                    ON UPDATE CASCADE)
        `);


        //telefones
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS telefones (
                Id INT NOT NULL AUTO_INCREMENT,
                IdCliente INT NOT NULL,
                Numero VARCHAR(15) NOT NULL,
                DataCad TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (Id),
                INDEX IdCliente (IdCliente ASC) VISIBLE,
                CONSTRAINT telefones_ibfk_1
                FOREIGN KEY (IdCliente)
                REFERENCES loja_ihs.clientes (Id)
                ON DELETE RESTRICT
                ON UPDATE CASCADE)
                
                `)



        //pedidos 
        await tempConnection.query(`
                    CREATE TABLE IF NOT EXISTS pedidos (
                        Id INT NOT NULL AUTO_INCREMENT,
                        ClienteId INT NOT NULL,
                        SubTotal DECIMAL(18,2) NOT NULL,
                        Status ENUM('Aberto', 'Finalizado', 'Pendente') NOT NULL,
                        DataCad TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                        PRIMARY KEY (Id, ClienteId),
                        INDEX FK_clientes_pedidos (ClienteId ASC) VISIBLE,
                        CONSTRAINT FK_clientes_pedidos
                        FOREIGN KEY (ClienteId)
                        REFERENCES loja_ihs.clientes (Id))
                        ENGINE = InnoDB
                        DEFAULT CHARACTER SET = utf8mb4
                        COLLATE = utf8mb4_0900_ai_ci;
                        `)



        //itemPedidos
        await tempConnection.query(`
                            CREATE TABLE IF NOT EXISTS itempedidos (
                                Id INT NOT NULL AUTO_INCREMENT,
                                PedidoId INT NOT NULL,
                                ProdutoId INT NOT NULL,
                                Quantidade DECIMAL(18,2) NOT NULL,
                                ValorItem DECIMAL(18,2) NOT NULL,
                                PRIMARY KEY (Id, PedidoId, ProdutoId),
                                INDEX fk_itens_pedido_pedidos (PedidoId ASC) VISIBLE,
                                INDEX FK_itensPedidos_produtos (ProdutoId ASC) VISIBLE,
                                CONSTRAINT fk_itens_pedido_pedidos
                                    FOREIGN KEY (PedidoId)
                                    REFERENCES loja_ihs.pedidos (Id),
                                CONSTRAINT FK_itensPedidos_produtos
                                    FOREIGN KEY (ProdutoId)
                                    REFERENCES loja_ihs.produtos (Id))
                            `)
        await tempConnection.end();
        console.log("Banco de dados e tabelas verificados/criados com sucesso.");
    } catch (error) {
        console.error("Erro ao criar o banco ou as tabelas:", error);
        throw error;
    }
}


