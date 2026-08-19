
import { Router } from "express";

import {
    obtenerTramites,
    buscarTramites,
    crearTramite,
    actualizarTramite,
    darDeBajaTramite,
    enviarAReactivarTramite,
    reactivarTramite
} from "./tramite.controller.js";

import { estaAutenticado } from "../../middleware/autenticacion.middleware.js";

const router = Router();

router.get('/', estaAutenticado(), obtenerTramites);

router.get('/buscar', estaAutenticado(), buscarTramites);

router.post('/', estaAutenticado(), crearTramite);

router.put('/:id', estaAutenticado(), actualizarTramite);

router.put('/:id/baja', estaAutenticado(), darDeBajaTramite);

router.put('/:id/enviar-reactivar', estaAutenticado(), enviarAReactivarTramite);

router.put('/:id/reactivar', estaAutenticado(), reactivarTramite);


export default router;