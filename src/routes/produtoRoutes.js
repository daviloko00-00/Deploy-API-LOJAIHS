import {Router} from "express";
import produtoController from "../controllers/produtoController.js";
import uploadImage from "../middlewares/uploadImage.middleware.js";
const produtoRoutes = Router(); 

produtoRoutes.post("/", uploadImage, produtoController.criar);
produtoRoutes.put("/", uploadImage, produtoController.atualizar);
produtoRoutes.delete("/:id", uploadImage, produtoController.deletar);
produtoRoutes.get("/", produtoController.selecionar);
produtoRoutes.get("/detalhes", produtoController.selecao_detalhada);
export default produtoRoutes