import { Router } from "express";
import telefoneController from "../controllers/telefoneController.js";

const telefoneRoutes = Router(); 

telefoneRoutes.post("/", telefoneController.criar);
telefoneRoutes.put("/", telefoneController.atualizar);
telefoneRoutes.delete("/:id", telefoneController.deletar);
telefoneRoutes.get("/", telefoneController.selecionar);
export default telefoneRoutes