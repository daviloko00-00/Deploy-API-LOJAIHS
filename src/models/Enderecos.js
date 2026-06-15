export class Enderecos {
    #id;
    #idCliente;
    #cep;
    #logradouro;
    #numero;
    #bairro;
    #cidade;
    #estado;
    #complemento
    #dataCad;

    constructor(
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        idCliente,
        id = null,
        dataCad = new Date()
    ) {
        this.#cep = cep;
        this.#logradouro = logradouro;
        this.#numero = numero;
        this.#bairro = bairro;
        this.#cidade = cidade;
        this.#estado = estado;
        this.#idCliente = idCliente;
        this.#id = id;
        this.#dataCad = dataCad;
    }

    
    // GETTERS
    
    get id() {
        return this.#id;
    }

    get idCliente() {
        return this.#idCliente;
    }

    get cep() {
        return this.#cep;
    }

    get logradouro() {
        return this.#logradouro;
    }

    get numero() {
        return this.#numero;
    }

    get bairro() {
        return this.#bairro;
    }

    get cidade() {
        return this.#cidade;
    }

    get estado() {
        return this.#estado;
    }

    get dataCad() {
        return this.#dataCad;
    }

    
    // SETTERS
    
    set id(value) {
        if (value !== null && value !== undefined) {
            this.#validarId(value);
        }
        this.#id = value;
    }

    set idCliente(value) {
        this.#validarId(value);
        this.#idCliente = value;
    }

    set cep(value) {
        this.#validarCep(value);
        this.#cep = cepLimpo;
    }

    set logradouro(value) {
        this.#validarTexto(value, "Logradouro");
        this.#logradouro = value.trim();
    }

    set numero(value) {
        if (!value) {
            throw new Error("Número é obrigatório");
        }
        this.#numero = String(value).trim();
    }

    set bairro(value) {
        this.#validarTexto(value, "Bairro");
        this.#bairro = value.trim();
    }

    set cidade(value) {
        this.#validarTexto(value, "Cidade");
        this.#cidade = value.trim();
    }

    set estado(value) {
        this.#estado = value.toUpperCase();
    }

    set complemento(value ){

    }

    set dataCad(value) {
        if (!(value instanceof Date)) {
            throw new Error("Data inválida");
        }
        this.#dataCad = value;
    }

    
    // VALIDAÇÕES
    
    #validarId(value) {
        if (isNaN(value) || Number(value) <= 0) {
            throw new Error("ID inválido");
        }
    }

    #validarCep(value) {
        if (value.length !== 8 || isNaN(value)) {
            throw new Error("CEP inválido (deve ter 8 dígitos)");
        }
    }

    #validarTexto(value, campo) {
        if (!value || typeof value !== "string" || value.trim().length < 2) {
            throw new Error(`${campo} inválido`);
        }
    }


    

    
    // FACTORY METHODS
    
    static criar({
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        complemento
        
    }) {
        if (
            !cep || !logradouro || !numero ||
            !bairro || !cidade || !estado 
        ) {
            throw new Error("Dados obrigatórios faltando");
        }
        // console.log(cep,
        //     logradouro,
        //     numero,
        //     bairro,
        //     cidade,
        //     estado,)
        return new Enderecos(
            cep,
            logradouro,
            numero,
            bairro,
            cidade,
            estado,
            null
        );
    }

    static editar({
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        idCliente
    }, id) {

        if (!id || isNaN(id)) {
            throw new Error("ID é obrigatório para edição");
        }

        return new Enderecos(
            cep,
            logradouro,
            numero,
            bairro,
            cidade,
            estado,
            idCliente,
            id
        );
    }

}
