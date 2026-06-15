# Backend - TechNova E-commerce API

API REST desenvolvida em Node.js e Express para gerenciar um sistema de e-commerce completo, com suporte a produtos, categorias, clientes, pedidos e telefones.

## Funcionalidades

- **Gerenciamento de Produtos**
  - CRUD completo de produtos com upload de imagens.
  - Associação com categorias.
  - Armazenamento de imagens no servidor.
- **Gerenciamento de Categorias**
  - CRUD de categorias de produtos.
  - Validações e persistência em banco de dados.
- **Gerenciamento de Clientes**
  - CRUD de clientes com validação de CPF.
  - Cadastro de endereços e telefones.
- **Gerenciamento de Pedidos**
  - Criação de pedidos com itens.
  - Consulta de status de pedidos.
  - Cálculo automático de subtotais.
- **Gerenciamento de Telefones**
  - CRUD de telefones dos clientes.
  - Limpeza automática de caracteres especiais.
- **Validações**
  - Validação de CPF no cadastro de clientes.
  - Limpeza de números de telefone.
- **Upload de Imagens**
  - Suporte a upload de imagens para produtos via Multer.
  - Armazenamento em servidor local.

## Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL2** - Driver para banco de dados MySQL
- **Multer** - Middleware para upload de arquivos
- **CORS** - Suporte a Cross-Origin Resource Sharing
- **Dotenv** - Gerenciamento de variáveis de ambiente

## Arquitetura

O projeto segue o padrão **MVC com camadas**:

- **Routes** - Definem os endpoints da API
- **Controllers** - Contêm a lógica de negócio
- **Models** - Representam as entidades do banco de dados
- **Repositories** - Encapsulam o acesso aos dados
- **Middlewares** - Validações e uploads
- **Utils** - Funções utilitárias

## Estrutura do Projeto

- `src/server.js` - Ponto de entrada da aplicação. Inicializa o Express e define as rotas principais.
- `src/configs/Database.js` - Configuração da conexão MySQL com pool de conexões.
- `src/configs/produto.multer.js` - Configuração do Multer para upload de imagens de produtos.

### Controllers
- `categoriaController.js` - Lógica para CRUD de categorias.
- `clienteController.js` - Lógica para CRUD de clientes com validação de CPF.
- `produtoController.js` - Lógica para CRUD de produtos e upload de imagens.
- `pedidoController.js` - Lógica para criar e consultar pedidos.
- `telefoneController.js` - Lógica para CRUD de telefones dos clientes.

### Models
- `Categoria.js` - Representação da tabela de categorias.
- `Produtos.js` - Representação da tabela de produtos.
- `Clientes.js` - Representação da tabela de clientes.
- `Pedidos.js` - Representação da tabela de pedidos.
- `itensPedidos.js` - Representação da tabela de itens dos pedidos.
- `Telefones.js` - Representação da tabela de telefones.
- `Enderecos.js` - Representação da tabela de endereços dos clientes.

### Repositories
- `categoriaRepository.js` - Acesso aos dados de categorias no banco.
- `produtoRepository.js` - Acesso aos dados de produtos no banco.
- `clienteRepository.js` - Acesso aos dados de clientes no banco.
- `pedidoRepository.js` - Acesso aos dados de pedidos no banco.
- `telefoneRepository.js` - Acesso aos dados de telefones no banco.

### Routes
- `categoriaRoutes.js` - Endpoints para gerenciar categorias.
- `produtoRoutes.js` - Endpoints para gerenciar produtos (CRUD e upload).
- `clienteRoutes.js` - Endpoints para gerenciar clientes.
- `pedidoRoutes.js` - Endpoints para gerenciar pedidos.
- `telefoneRoutes.js` - Endpoints para gerenciar telefones.
- `routes.js` - Agregador principal de rotas.

### Utilitários
- `utils/validarCpf.js` - Função para validação de CPF.
- `utils/limparNumero.js` - Função para limpeza de números de telefone.

### Middlewares
- `middlewares/uploadImage.middleware.js` - Configuração do Multer para upload de imagens.

### Banco de Dados
- `DOCS/arquivo_bd.sql` - Script SQL para criação das tabelas do banco de dados.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL Server
- npm ou yarn

## Como executar

### 1. Instale as dependências

npm install

### 2. Configure o banco de dados

1. Crie um banco de dados MySQL (ou use um existente).
2. Execute o script SQL localizado em `DOCS/arquivo_bd.sql` para criar as tabelas.
3. Configure as variáveis de ambiente (veja próxima etapa).

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=loja_ihs
DB_PORT=3306
SERVER_PORT=8081

### 4. Inicie o servidor

npm start

O servidor estará disponível em `http://localhost:8081`.

## Endpoints da API

### Categorias

- `GET /categorias` - Lista todas as categorias
- `GET /categorias/:id` - Busca categoria por ID
- `POST /categorias` - Cria nova categoria
- `PUT /categorias/:id` - Atualiza categoria
- `DELETE /categorias/:id` - Remove categoria

### Produtos

- `GET /produtos` - Lista todos os produtos
- `GET /produtos/detalhes` - Lista produtos com detalhes
- `GET /produtos/:id` - Busca produto por ID
- `POST /produtos` - Cria novo produto (com upload de imagem)
- `PUT /produtos/:id` - Atualiza produto
- `DELETE /produtos/:id` - Remove produto

### Clientes

- `GET /clientes` - Lista todos os clientes
- `GET /clientes/:id` - Busca cliente por ID
- `POST /clientes` - Cria novo cliente
- `PUT /clientes/:id` - Atualiza cliente
- `DELETE /clientes/:id` - Remove cliente

### Pedidos

- `GET /pedidos` - Lista todos os pedidos
- `GET /pedidos/:id` - Busca pedido por ID com itens
- `POST /pedidos` - Cria novo pedido

### Telefones

- `GET /telefones` - Lista todos os telefones
- `GET /telefones/:id` - Busca telefone por ID
- `POST /telefones` - Cria novo telefone
- `PUT /telefones/:id` - Atualiza telefone
- `DELETE /telefones/:id` - Remove telefone

## Banco de Dados

As tabelas principais do banco `loja_ihs`:

- `categorias` - Categorias de produtos
- `produtos` - Produtos da loja
- `clientes` - Dados dos clientes
- `pedidos` - Pedidos realizados
- `itens_pedidos` - Itens de cada pedido
- `telefones` - Telefones dos clientes
- `enderecos` - Endereços dos clientes

## Padrões e Boas Práticas

- **ES6 Modules** - Uso de `import`/`export`
- **Async/Await** - Operações assíncronas
- **Repository Pattern** - Separação da lógica de acesso a dados
- **Middleware Pattern** - Validações e uploads
- **Validações** - CPF validado no cadastro e números de telefone limpos

## Tratamento de Erros

A API retorna códigos HTTP apropriados:

- `200` - Sucesso
- `201` - Criado
- `400` - Requisição inválida
- `404` - Não encontrado
- `500` - Erro interno do servidor

## Observações Importantes

- O endpoint `/produtos/detalhes` é usado pelo frontend para buscar produtos com informações completas.
- Imagens de produtos são armazenadas na pasta `uploads/images/` e referenciadas pelos controllers.
- O banco de dados está configurado para usar `utf8mb4` para suporte a caracteres especiais.

## Sugestões de Melhoria

- implementar autenticação e autorização (JWT);
- adicionar paginação nos endpoints de listagem;
- criar testes unitários e de integração;
- implementar logging estruturado;
- adicionar cache para produtos frequentemente acessados.