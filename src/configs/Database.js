import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

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
    console.log("Inicializando banco...");

    try {
        const tempConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            ssl: { rejectUnauthorized: false }
        });

        const dbName = process.env.DB_DATABASE || 'deploy';

        await tempConnection.query(
            `CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`
        );

        await tempConnection.query(
            `USE \`${dbName}\`;`
        );

        // CATEGORIAS
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS categorias (
                Id INT NOT NULL AUTO_INCREMENT,
                Nome VARCHAR(45) NOT NULL,
                Descricao VARCHAR(100) DEFAULT NULL,
                DataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (Id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        // CLIENTES
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS clientes (
                Id INT NOT NULL AUTO_INCREMENT,
                Nome VARCHAR(100) NOT NULL,
                Cpf CHAR(11) NOT NULL,
                DataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (Id),
                UNIQUE (Cpf)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        // ENDERECOS
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS enderecos (
                Id INT NOT NULL AUTO_INCREMENT,
                IdCliente INT NOT NULL,
                Cep CHAR(8) NOT NULL,
                Logradouro VARCHAR(100) NOT NULL,
                Numero VARCHAR(10) NOT NULL,
                Bairro VARCHAR(50) NOT NULL,
                Cidade VARCHAR(50) NOT NULL,
                Estado CHAR(2) NOT NULL,
                Complemento VARCHAR(100) DEFAULT NULL,
                DataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                PRIMARY KEY (Id),
                INDEX (IdCliente),

                CONSTRAINT fk_endereco_cliente
                    FOREIGN KEY (IdCliente)
                    REFERENCES clientes(Id)
                    ON DELETE RESTRICT
                    ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        // PRODUTOS
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS produtos (
                Id INT NOT NULL AUTO_INCREMENT,
                IdCategoria INT NOT NULL,
                Nome VARCHAR(100) NOT NULL,
                Valor DECIMAL(10,2) NOT NULL,
                CaminhoImagem VARCHAR(255) DEFAULT NULL,
                DataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                PRIMARY KEY (Id),
                INDEX (IdCategoria),

                CONSTRAINT fk_produto_categoria
                    FOREIGN KEY (IdCategoria)
                    REFERENCES categorias(Id)
                    ON DELETE RESTRICT
                    ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        // TELEFONES
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS telefones (
                Id INT NOT NULL AUTO_INCREMENT,
                IdCliente INT NOT NULL,
                Numero VARCHAR(15) NOT NULL,
                DataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                PRIMARY KEY (Id),
                INDEX (IdCliente),

                CONSTRAINT fk_telefone_cliente
                    FOREIGN KEY (IdCliente)
                    REFERENCES clientes(Id)
                    ON DELETE RESTRICT
                    ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        // PEDIDOS
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS pedidos (
                Id INT NOT NULL AUTO_INCREMENT,
                ClienteId INT NOT NULL,
                SubTotal DECIMAL(18,2) NOT NULL,
                Status ENUM('Aberto', 'Finalizado', 'Pendente') NOT NULL,
                DataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                PRIMARY KEY (Id),
                INDEX (ClienteId),

                CONSTRAINT fk_pedido_cliente
                    FOREIGN KEY (ClienteId)
                    REFERENCES clientes(Id)
                    ON DELETE RESTRICT
                    ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        // ITEM PEDIDOS
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS itempedidos (
                Id INT NOT NULL AUTO_INCREMENT,
                PedidoId INT NOT NULL,
                ProdutoId INT NOT NULL,
                Quantidade DECIMAL(18,2) NOT NULL,
                ValorItem DECIMAL(18,2) NOT NULL,

                PRIMARY KEY (Id),
                INDEX (PedidoId),
                INDEX (ProdutoId),

                CONSTRAINT fk_item_pedido
                    FOREIGN KEY (PedidoId)
                    REFERENCES pedidos(Id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,

                CONSTRAINT fk_item_produto
                    FOREIGN KEY (ProdutoId)
                    REFERENCES produtos(Id)
                    ON DELETE RESTRICT
                    ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        await tempConnection.end();

        console.log("Banco inicializado com sucesso.");
    } catch (error) {
        console.error("Erro ao inicializar banco:", error);
        throw error;
    }
}