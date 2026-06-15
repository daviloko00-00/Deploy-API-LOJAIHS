export class Produto {
    #id 
    #idCategoria
    #nome
    #valor
    #caminhoImagem
    #dataCad

    constructor(id, idCategoria, nome, valor, caminhoImagem, dataCad){
        this.id = id;
        this.idCategoria = idCategoria;
        this.nome = nome;
        this.valor = valor;
        this.caminhoImagem = caminhoImagem;
        this.dataCad = dataCad;
    }

    // GETTERS
    get id(){
        return this.#id;
    }

    get idCategoria(){
        return this.#idCategoria;
    }

    get nome(){
        return this.#nome;
    }

    get valor(){
        return this.#valor;
    }

    get caminhoImagem(){
        return this.#caminhoImagem;
    }

    get dataCad(){
        return this.#dataCad;
    }

    // SETTERS
    set id(value){
        if(value !== undefined && value !== null){
            this.#validarId(value);
        }
        this.#id = value;
    }

    set idCategoria(value){
        this.#validarIdCategoria(value);
        this.#idCategoria = value;
    }

    set nome(value){
        this.#validarNome(value);
        this.#nome = value;
    }

    set valor(value){
        this.#validarValor(value);
        this.#valor = value;
    }

    set caminhoImagem(value){
        this.#caminhoImagem = value || null;
    }

    set dataCad(value){
        this.#dataCad = value || new Date();
    }

    // VALIDAÇÕES
    #validarNome(value){
        if(!value || value.trim().length < 3 || value.trim().length > 100){
            throw new Error("O campo nome é obrigatório e deve ter entre 3 e 100 caracteres");
        }
    }

    #validarIdCategoria(value){
        if(!value || isNaN(value) || value <= 0){
            throw new Error("O campo idCategoria é obrigatório e deve ser um número inteiro válido");
        }
    }

    #validarId(value){
        if(isNaN(value) || value <= 0){
            throw new Error("O valor de Id não corresponde com o esperado");
        }
    }

    #validarValor(value){
        if(value === undefined || value === null || isNaN(value) || value < 0){
            throw new Error("O valor do produto deve ser um número válido e maior ou igual a zero");
        }
    }

    // Design Pattern : Factory
static criar(dados){
    return new Produto(
        null,
        dados.idCategoria,
        dados.nome,
        dados.valor,
        dados.caminhoImagem,
        
    );
}

static editar(dados, id){
    return new Produto(
        id,
        dados.idCategoria,
        dados.nome,
        dados.valor,
        dados.caminhoImagem,
        
    );
}
}