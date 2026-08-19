import {Router} from "express";
import { login, register, logout, getProfile } from "./autenticacion.controller.js";
import {estaAutenticado} from "../../middleware/autenticacion.middleware.js";

const router = Router();

router.post("/login", login);

router.post("/register", register);

router.post("/logout", logout);

router.get("/profile", estaAutenticado(), getProfile);

export default router;
