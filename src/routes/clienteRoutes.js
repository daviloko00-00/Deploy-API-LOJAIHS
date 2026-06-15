import { Router } from "express";
import clienteController from "../controllers/clienteController.js";
const clienteroutes = Router(); 

clienteroutes.post("/criar", clienteController.criar);
clienteroutes.put("/", clienteController.atualizar);
clienteroutes.delete("/:id", clienteController.deletar);
clienteroutes.get("/", clienteController.selecionar);
clienteroutes.get("/:id", clienteController.selecionarPorId);
export default clienteroutes