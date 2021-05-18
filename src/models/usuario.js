import { Schema, model } from "mongoose";
const mensajeSchema = new Schema({
  mensaje_texto: {
    type: Schema.Types.String,
    required: true,
    minlength: 1,
  },
  mensaje_fecha: {
    type: Schema.Types.Date,
    required: true,
  },
  mensaje_room: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});
const usuarioSchema = new Schema({
  usuario_correo: {
    type: Schema.Types.String,
    unique: true,
    required: true,
  },
  usuario_nombre: {
    type: Schema.Types.String,
    required: true,
  },
  usuario_lastlogin: {
    type: Schema.Types.Date,
    required: true,
  },
  usuario_estado: {
    type: Schema.Types.Boolean,
  },
  mensajes: [mensajeSchema],
});

export const Usuario = model("usuario", usuarioSchema);
