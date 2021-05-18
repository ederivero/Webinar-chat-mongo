import express from "express";
import { json } from "body-parser";
import { createServer } from "http";
import { connect } from "mongoose";
import { Server as socketio } from "socket.io";
import { cerrarSesion, iniciarSesion } from "../controller/socket";
import { usuario_router } from "../routes/usuario";
// sirve para utilizar las variables del archivo .env
require("dotenv").config();

export class Server {
  constructor() {
    this.app = express();
    this.puerto = process.env.PORT || 5000;
    this.httpServer = new createServer(this.app);
    this.io = new socketio(this.httpServer, { cors: { origin: "*" } });
    this.bodyParser();
    this.CORS();
    this.rutas();
    this.escucharSockets();
    if (typeof Server.instance === "object") {
      console.log("ya habia una instancia creada");
      return Server.instance;
    } else {
      console.log("no habia");
      Server.instance = this;
      return this;
    }
  }
  CORS() {
    this.app.use((req, res, next) => {
      // Permitir los origenes (dominios) para que puedan consultar a mi API
      res.header("Access-Control-Allow-Origin", "*");
      // Permitir las cabeceras siguientes
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      // Permitir los metodos siguientes
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
      // Si todo cumple con lo estipulado anteriormente
      next();
    });
  }
  bodyParser() {
    this.app.use(json());
  }
  rutas() {
    this.app.get("/", (req, res) => {
      res.send("Bienvenido a mi API 😀");
    });
    this.app.use(usuario_router);
  }
  escucharSockets() {
    console.log("escuchando socket");
    this.io.on("connect", (cliente) => {
      console.log("Se conectó " + cliente.id);
      cliente.on("login", async (usuario) => {
        iniciarSesion(usuario);
      });
      cliente.on("logout", async (usuario) => {
        cerrarSesion(usuario);
      });
      cliente.on("disconnect", () => {
        console.log("Se desconectó " + cliente.id);
      });
    });
  }
  start() {
    this.httpServer.listen(this.puerto, () => {
      console.log(
        `Servidor corriendo exitosamente en el puerto ${this.puerto}`
      );
      connect(process.env.MONGO_DB, {
        // https://mongoosejs.com/docs/connections.html#options
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
        .then(() => {
          console.log("Base de datos conectada exitosamente");
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
}
