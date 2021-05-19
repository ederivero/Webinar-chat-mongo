import { Server } from "../config/server";
import { Room } from "../models/room";
import { Usuario } from "../models/usuario";

export const crearRoom = async (data) => {
  const objServidor = new Server();
  const { nombre } = data;
  await Room.create({ room_nombre: nombre });
  const rooms = await Room.find({});
  objServidor.io.emit("emitirRooms", { rooms });
};

export const crearMensaje = async (data) => {
  const objServidor = new Server();
  const { usuario_correo, mensaje, room } = data;
  const { mensajes } = await Usuario.findOne({ usuario_correo });
  mensajes.push({
    mensaje_texto: mensaje,
    mensaje_fecha: new Date(),
    mensaje_room: room,
  });
  await Usuario.findOneAndUpdate({ usuario_correo }, { mensajes });
  const usuarios = await Usuario.find();
  objServidor.io.emit("emitir-mensajes", { usuarios });
};

const sesiones = async (usuario, accion) => {
  const objServidor = new Server();
  const { usuario_correo } = usuario;
  const usuarioEncontrado = await Usuario.findOne({ usuario_correo });
  if (usuarioEncontrado) {
    if (accion === "login") {
      await Usuario.findOneAndUpdate(
        { usuario_correo },
        { usuario_estado: true, usuario_lastlogin: new Date() }
      );
    }
    if (accion === "logout") {
      await Usuario.findOneAndUpdate(
        { usuario_correo },
        { usuario_estado: false }
      );
    }
    const usuariosActivos = await Usuario.find().where({
      usuario_estado: true,
    });
    objServidor.io.emit("emitir-usuarios", { usuariosActivos });
  } else {
    objServidor.io.disconnectSockets(true);
  }
};

export const iniciarSesion = async (usuario) => {
  sesiones(usuario, "login");
};

export const cerrarSesion = async (usuario) => {
  sesiones(usuario, "logout");
};
