import {Router} from "express";
import {obtenerTiposTramites} from "./tipo_tramite.controller.js";

const router = Router();

router.get('/', obtenerTiposTramites);

export default router;