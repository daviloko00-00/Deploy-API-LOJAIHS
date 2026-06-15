export class Categoria {
    #id;
    #nome;
    #descricao;
    #dataCad;
// qualquer atributo ou propriedade que pode ser nulo, coloque no final
//validar primeiro para depois atribuir.
    constructor(pNome, pDescricao, pId){
        this.nome = pNome;
        this.descricao = pDescricao; 
        this.#id = pId ; 
    }

    get nome(){
        return this.#nome
    }
    
    get descricao(){
        return this.#descricao
    }

    get id(){
        return this.#id
    }

    set nome(value){
        this.#validarNome(value);
        this.#nome = value;
    }
    set descricao(value){
        this.#validarDescricao(value);
        this.#descricao = value;
    }

    set id(value){
        this.#validarId(value);
        this.#id = value;
    }


    #validarNome(value){
        if(!value || value.trim().length <3 || value.trim().length > 45){
            throw new Error("O campo nome é obrigatório e deve ter entre 3 e 45 caracteres")
        }
    }
    #validarDescricao(value){
        if(value && (value.trim().length < 5 ||  value.trim().length > 100)){
            throw new Error("O campo descrição deve ter entre 5 caracteres e máximo 100 caracteres")
        }
    }

    #validarId(value){
        if(!value && value <0 ){
            throw new Error("O valor de Id não corresponde com o esperado");
        }
    }


    // Design Patern : Factory
    //cria uma instancia na classe : objeto
    static criar(dados){
        return new Categoria(dados.nome, dados.descricao, null);
    }
    //cria uma instancia com dados que serão utilizados para edição de uma categoria no banco
    static editar(dados, id){
        return new Categoria(dados.nome, dados.descricao, id);
    }

}