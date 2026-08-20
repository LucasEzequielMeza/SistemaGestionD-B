import { Router } from "express";

import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    cambiarContraseña,
    cambiarEstadoUsuario
} from "./usuario.controller.js";

import {estaAutenticado} from "../../middleware/autenticacion.middleware.js"

const router = Router();


router.get("/", estaAutenticado(), obtenerUsuarios);

router.get("/:id", estaAutenticado(), obtenerUsuarioPorId);

router.put("/:id", estaAutenticado(), actualizarUsuario);

router.put("/:id/password", estaAutenticado(), cambiarContraseña);

router.put("/:id/estado", estaAutenticado(), cambiarEstadoUsuario);


export default router;