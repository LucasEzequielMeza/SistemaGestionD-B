import { Router } from "express";

import {
    obtenerDocumentosPorTramite,
    actualizarDocumentoTramite,
    marcarDocumentoRecibido,
    marcarDocumentoCargadoLex,
    marcarDocumentoPendiente,
    volverDocumentoPendiente,
    volverDocumentoRecibido
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
    '/tramite-documento/:id/pendiente',
    marcarDocumentoPendiente
);
router.put(
    '/tramite-documento/:id/recibido',
    marcarDocumentoRecibido
);

router.put(
    '/tramite-documento/:id/cargar-lex',
    marcarDocumentoCargadoLex
);

router.put(
    '/tramite-documento/:id/volver-pendiente',
    volverDocumentoPendiente
);

router.put(
    '/tramite-documento/:id/volver-recibido',
    volverDocumentoRecibido
);


export default router;