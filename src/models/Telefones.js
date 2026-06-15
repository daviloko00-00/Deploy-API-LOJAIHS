export class Telefone {
    #id;
    #numero;
    #idCliente;

    constructor(numero, idCliente, id = null) {
        this.numero = numero;         
        this.idCliente = idCliente;   
        this.id = id;                 
    }

    // GETTERS

    get numero() {
        return this.#numero;
    }

    get idCliente() {
        return this.#idCliente;
    }

    get id() {
        return this.#id;
    }

    // SETTERS

    set numero(value) {
        this.#validarNumero(value);
        this.#numero = value; 
    }

    set idCliente(value) {
        //this.#validarId(value);
        this.#idCliente = Number(value);
    }

    set id(value) {
        if (value !== null && value !== undefined) {
            this.#validarId(value);
            this.#id = Number(value);
        } else {
            this.#id = null;
        }
    }

    // VALIDAÇÕES
   
    #validarId(value) {
        if (value == null || isNaN(value) || Number(value) <= 0) {
            throw new Error("ID inválido");
        }
    }

    #validarNumero(value) {
        if (value == null) {
            throw new Error("Número é obrigatório");
        }

        
        if (value.length < 10 ||value.length > 11) {
            throw new Error("Número inválido (deve ter 10 ou 11 dígitos)");
        }
    }

    // FACTORY METHODS

    static criar({ numero, idCliente = null }) {
        if (numero == null) {
            throw new Error("numero é obrigatório");
        }
        
        console.log(numero, idCliente);
        return new Telefone(numero, idCliente);
    }

    static editar({ numero, idCliente }, id) {
        if (id == null || isNaN(id)) {
            throw new Error("ID é obrigatório para edição");
        }

        return new Telefone(numero, idCliente, id);
    }
}