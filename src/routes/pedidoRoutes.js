import {Router} from "express";
import pedidoController from "../controllers/pedidoController.js";
const pedidoRoutes = Router(); 

pedidoRoutes.post('/', pedidoController.criar)
pedidoRoutes.get('/', pedidoController.selecionar)
pedidoRoutes.get('/:id', pedidoController.selecionar)
pedidoRoutes.post("/:id/itens", pedidoController.adicionarItemPedido);
pedidoRoutes.put("/:idPedido/item", pedidoController.editarItemExistente);
pedidoRoutes.put("/updateStatus", pedidoController.atualizarStatus)
pedidoRoutes.delete("/itens/:id", pedidoController.deleteItemPedido)
export default pedidoRoutes;