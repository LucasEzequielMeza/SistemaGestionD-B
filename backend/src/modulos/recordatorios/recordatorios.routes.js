import { Router } from "express";

import {
    obtenerRecordatorios,
    crearRecordatorio,
    actualizarRecordatorio,
    eliminarRecordatorio,
    recordatorioFinalizado
} from "./recordatorios.controller.js";

import {estaAutenticado} from "../../middleware/autenticacion.middleware.js";

const router = Router();


// Obtengo los recordatorios del usuario autenticado
router.get("/", estaAutenticado(), obtenerRecordatorios);

// Creo un nuevo recordatorio
router.post("/", estaAutenticado(), crearRecordatorio);

// Actualizo un recordatorio existente
router.put("/:id", estaAutenticado(), actualizarRecordatorio);

// Marco un recordatorio como completado
router.put("/:id/finalizar", estaAutenticado(), recordatorioFinalizado);

// Elimino un recordatorio
router.delete("/:id", estaAutenticado(), eliminarRecordatorio);


export default router;