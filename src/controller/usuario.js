import { Usuario } from "../models/usuario";
export const registro = async (req, res) => {
  try {
    const usuarioCreado = await Usuario.create({
      ...req.body,
      usuario_lastlogin: new Date(),
    });
    return res.status(201).json({
      message: "Usuario creado exitosamente",
      content: usuarioCreado,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Usuario ya existe",
    });
  }
};

export const logout = async (req, res) => {
  const { id } = req.params;
  try {
    await Usuario.findByIdAndUpdate({ _id: id }, { usuario_estado: false });
    return res.status(201).json({
      message: "Sesion finalizada",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Usuario no existe",
    });
  }
};
