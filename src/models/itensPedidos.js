export class itemPedidos {
    #id;
    #pedidoId
    #produtoId;
    #quantidade;
    #valorItem;


    //constructor
    constructor( produtoId, quantidade, valorItem, id, pedidoId) {
        this.pedidoId = pedidoId
        this.produtoId = produtoId
        this.quantidade = quantidade
        this.valorItem = valorItem
        this.id = id
        console.log("constructor", pedidoId, produtoId, quantidade, valorItem, id)
    }


    //Getters
    get id() {
        return this.#id;
    }

    get pedidoId() {
        return this.#pedidoId;
    }

    get produtoId() {
        return this.#produtoId;
    }

    get quantidade() {
        return this.#quantidade;
    }

    get valorItem() {
        return this.#valorItem;
    }



    //Setters

    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }
    set pedidoId(value) {
        console.log("setter", value)
        this.#validarPedidoId(value);
        this.#pedidoId = value;
    }
    set produtoId(value) {
        this.#validarProdutoId(value);
        this.#produtoId = value;
    }
    set quantidade(value) {
        this.#validarquantidade(value);
        this.#quantidade = value;
    }
    set valorItem(value) {
        this.#validarValorItem(value);
        this.#valorItem = value;
    }


    //Métodos auxiliares

    #validarId(value) {
        if (!value && value < 0) {
            throw new Error("Verifique o id informado")
        }
    }
    #validarPedidoId(value) {
        console.log("validação",value)
        if (!value && value < 0) {
            throw new Error("Verifique o id do pedido informado")
        }

    }
    #validarProdutoId(value) {
        if (!value || value <= 0) {
            throw new Error("Verifique o id do produto informado")
        }
    }

    #validarquantidade(value) {
        if (!value || value < 0) {
            throw new Error("Não foi possívle obter o quantidade")
        }
    }

    #validarValorItem(value) {
        if (!value || value < 0) {
            throw new Error("informe um valor para o item")
        }
    }

    //design patterns

     static calcularSubTotal(itens) {
        return itens.reduce(
            (total, item) => total + (item.valorItem * item.quantidade),
            0
        );
    }
    

    static criar(dados) {
        return new itemPedidos(
            dados.produtoId,
            dados.quantidade,
            dados.valorItem
        );
    }
    static editar(dados) {
        return new itemPedidos(dados.pedidoId, dados.produtoId, dados.quantidade, dados.valorItem, id);

    }

    
}