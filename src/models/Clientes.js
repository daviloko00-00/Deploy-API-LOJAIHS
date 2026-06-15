export class Cliente {
    #id;
    #nome;
    #cpf;

    constructor(nome, cpf, id = null) {
        this.nome = nome;
        this.cpf = cpf;
        this.id = id;
    }

    // GETTERS
    get nome() {
        return this.#nome;
    }

    get cpf() {
        return this.#cpf;
    }

    get id() {
        return this.#id;
    }

    // SETTERS
    set nome(value) {
        this.#validarNome(value);
        this.#nome = value.trim();
    }

    set cpf(value) {
        this.#validarCpf(value);
        this.#cpf = value;
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
    #validarNome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 45) {
            throw new Error("Nome deve ter entre 3 e 45 caracteres");
        }
    }

    #validarCpf(value) {
        if (!value || String(value).length !== 11) {
            throw new Error("CPF deve ter 11 caracteres");
        }
    }

    #validarId(value) {
        if (isNaN(value) || Number(value) <= 0) {
            throw new Error("ID inválido");
        }
    }

    // FACTORY
    static criar({ nome, cpf }) {
        if (!nome || !cpf) {
            throw new Error("Nome e CPF são obrigatórios");
        }

        return new Cliente(nome, cpf);
    }

    static editar({ nome, cpf }, id) {
        if (!id) {
            throw new Error("ID obrigatório");
        }

        return new Cliente(nome, cpf, id);
    }
}