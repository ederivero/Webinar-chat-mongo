import { Router } from "express";
import { logout, registro } from "../controller/usuario";

export const usuario_router = Router();
usuario_router.post("/register", registro);
usuario_router.post("/log-out/:id", logout);
