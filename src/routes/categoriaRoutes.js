import {Router} from "express";
import categoriaController from "../controllers/categoriaController.js";

const categoriaroutes = Router(); 

categoriaroutes.post("/", categoriaController.criar);
categoriaroutes.put("/", categoriaController.atualizar);
categoriaroutes.delete("/:id", categoriaController.deletar);
categoriaroutes.get("/", categoriaController.selecionar);
export default categoriaroutes