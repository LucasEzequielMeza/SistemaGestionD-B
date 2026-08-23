import {Router} from "express";
import { login, register, logout, getProfile } from "./autenticacion.controller.js";
import {estaAutenticado} from "../../middleware/autenticacion.middleware.js";
import { validateSchema } from "../../middleware/validacion.middleware.js";
import { loginSchema, registerSchema } from "../../schemas/autorizacion.schema.js";

const router = Router();

router.post("/login", validateSchema(loginSchema), login);

router.post("/register", validateSchema(registerSchema), register);

router.post("/logout", logout);

router.get("/profile", estaAutenticado(), getProfile);

export default router;
