export class Pedido {
    #id;
    #clienteId;
    #subtotal;
    #status;
    #dataCad;

    constructor(clienteId, subtotal = 0, status, id = null) {
        this.clienteId = clienteId;
        this.subtotal = subtotal;
        this.status = status;
        this.id = id;
    }

    // Getters
    get id() {
        return this.#id;
    }

    get clienteId() {
        return this.#clienteId;
    }

    get subtotal() {
        return this.#subtotal;
    }

    get status() {
        return this.#status;
    }

    get dataCad() {
        return this.#dataCad;
    }

    // Setters
    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    set clienteId(value) {
        this.#validarClienteId(value);
        this.#clienteId = value;
    }

    set subtotal(value) {
        this.#validarSubtotal(value);
        this.#subtotal = value;
    }

    set status(value) {
        this.#status = value;
    }

    // Métodos auxiliares
    #validarId(value) {
        if (value !== null && value <= 0) {
            throw new Error("Verifique o id informado");
        }
    }

    #validarClienteId(value) {
        if (!value || value <= 0) {
            throw new Error("Verifique o id do cliente informado");
        }
    }

    #validarSubtotal(value) {
        if (value === undefined || value === null || isNaN(value) || value < 0) {
            throw new Error("Subtotal inválido");
        }
    }

    // Design patterns
    static criar(dados) {
        return new Pedido(
            dados.clienteId,
            dados.subtotalItens ?? 0,
            dados.status,
            null
        );
    }

    static editar(dados) {
        return new Pedido(
            dados.clienteId,
            dados.subtotal ?? 0,
            dados.status,
            dados.id
        );
    }
}