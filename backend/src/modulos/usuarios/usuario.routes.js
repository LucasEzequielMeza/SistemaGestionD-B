import { Router } from "express";

import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    cambiarContraseña,
    cambiarEstadoUsuario
} from "./usuario.controller.js";

import {estaAutenticado} from "../../middleware/autenticacion.middleware.js"
import {cambiarContraseñaSchema} from "../../schemas/autorizacion.schema.js";
import {validateSchema} from "../../middleware/validacion.middleware.js";

const router = Router();


router.get("/", estaAutenticado(), obtenerUsuarios);

router.get("/:id", estaAutenticado(), obtenerUsuarioPorId);

router.put("/password", estaAutenticado(), validateSchema(cambiarContraseñaSchema),cambiarContraseña);

router.put("/:id", estaAutenticado(), actualizarUsuario);

router.put("/:id/estado", estaAutenticado(), cambiarEstadoUsuario);


export default router;