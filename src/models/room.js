import { Schema, model } from "mongoose";
const room_schema = new Schema({
  room_nombre: {
    type: Schema.Types.String,
    required: true,
  },
});

export const Room = model("room", room_schema);
