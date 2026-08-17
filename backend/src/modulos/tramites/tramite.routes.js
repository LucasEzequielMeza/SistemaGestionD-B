
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

const router = Router();

router.get('/', obtenerTramites);

router.get('/buscar', buscarTramites);

router.post('/', crearTramite);

router.put('/:id', actualizarTramite);

router.put('/:id/baja', darDeBajaTramite);

router.put('/:id/enviar-reactivar', enviarAReactivarTramite);

router.put('/:id/reactivar', reactivarTramite);


export default router;