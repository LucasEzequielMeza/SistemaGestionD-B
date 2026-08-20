import { Router } from "express";

import {
    obtenerDocumentosPorTramite,
    actualizarDocumentoTramite,
    marcarDocumentoRecibido,
    marcarDocumentoCargadoLex
} from "./documentos.controller.js";


const router = Router();

router.get(
    '/tramite/:tramite_id',
    obtenerDocumentosPorTramite
);

router.put(
    '/tramite-documento/:id',
    actualizarDocumentoTramite
);

router.put(
    '/tramite-documento/:id/recibido',
    marcarDocumentoRecibido
);

router.put(
    '/tramite-documento/:id/cargar-lex',
    marcarDocumentoCargadoLex
);


export default router;