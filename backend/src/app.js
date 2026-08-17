import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import autenticacionRoutes from "./modulos/autenticacion/autenticacion.routes.js";
import tipoTramitesRoutes from "./modulos/tipo_tramites/tipo_tramite.routes.js";
import tramitesRoutes from "./modulos/tramites/tramite.routes.js";
const app = express();

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/auth", autenticacionRoutes);
app.use("/api/tipo-tramites", tipoTramitesRoutes);
app.use("/api/tramites", tramitesRoutes);

// Manejador de erores en express para todas las rutas

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: "error",
    message: err.message
   });
});

export default app;