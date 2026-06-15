export function limparNumero(valor) {
    if (valor === undefined || valor === null) {
        return "";
    }

    return valor.toString().replace(/\D/g, "");
}