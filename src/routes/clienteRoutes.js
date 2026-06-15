import { Router } from "express";
import clienteController from "../controllers/clienteController.js";
const clienteroutes = Router(); 

clienteroutes.post("/criar", clienteController.criar);
clienteroutes.put("/", clienteController.atualizar);
clienteroutes.delete("/:id", clienteController.deletar);
clienteroutes.get("/:id", clienteController.selecionar);
export default clienteroutes