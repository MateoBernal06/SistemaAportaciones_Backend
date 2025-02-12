// Importar JWT y el Modelo
import jwt from "jsonwebtoken";
import Tesorero from "../models/tesorero.js";
import Aportante from "../models/aportante.js";

// Método para proteger rutas
const verificarAutenticacion = async (req, res, next) => {
  // Validación si se está enviando el token
  if (!req.headers.authorization)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, debes proprocionar un token" });
  // Desestructurar el token pero del headers
  const { authorization } = req.headers;
  // Capturar errores
  try {
    // verificar el token recuperado con el almacenado
    const { id, rol } = jwt.verify(
      authorization.split(" ")[1],
      process.env.JWT_SECRET
    );
    // Verificar el rol
    if (rol === "tesorero") {
      // Obtener el usuario
      req.tesoreroBDD = await Tesorero.findById(id).lean().select("-password");
      req.aportanteBDD = await Aportante.findById(id)
        .lean()
        .select("-password");
      // Continue el proceso
      next();
    } else {
      console.log(id, rol);
      req.aportanteBDD = await Aportante.findById(id)
        .lean()
        .select("-password");
      console.log(req.aportanteBDD);
      next();
    }
  } catch (error) {
    // Capturar errores y presentarlos
    const e = new Error("Formato del token no válido");
    return res.status(404).json({ msg: e.message });
  }
};
// Exportar el método
export default verificarAutenticacion;
