
import { Router } from "express";

import {
    obtenerTramites,
    obtenerTramitePorId,
    buscarTramites,
    obtenerTipoTramite,
    crearTramite,
    actualizarTramite,
    darDeBajaTramite,
    enviarAReactivarTramite,
    reactivarTramite,
    finalizarTramite,
    obtenerTramitesPorEstado,
    reactivarTramiteEnviadoABaja,
    obtenerResumenDashboard
} from "./tramite.controller.js";

import { estaAutenticado } from "../../middleware/autenticacion.middleware.js";

const router = Router();

router.get('/', estaAutenticado(), obtenerTramites);

router.get('/buscar', estaAutenticado(), buscarTramites);

router.get('/tipos-tramite', estaAutenticado(), obtenerTipoTramite);

router.get('/dashboard', estaAutenticado(), obtenerResumenDashboard);

router.get('/estado/:estado', estaAutenticado(), obtenerTramitesPorEstado);

router.get('/:id', estaAutenticado(), obtenerTramitePorId);

router.post('/', estaAutenticado(), crearTramite);

router.put('/:id', estaAutenticado(), actualizarTramite);

router.put('/:id/baja', estaAutenticado(), darDeBajaTramite);

router.put('/:id/reactivar-baja', estaAutenticado(), reactivarTramiteEnviadoABaja);

router.put('/:id/enviar-reactivar', estaAutenticado(), enviarAReactivarTramite);

router.put('/:id/reactivar', estaAutenticado(), reactivarTramite);

router.put('/:id/finalizar', estaAutenticado(), finalizarTramite);


export default router;