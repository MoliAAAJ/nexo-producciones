"use strict";

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

/**
 * Middleware de Autenticación Básica
 */
export const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin"');
    return res.status(401).json({ ok: false, error: "No autorizado" });
  }

  try {
    const base64 = authHeader.replace("Basic ", "");
    const decoded = Buffer.from(base64, "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return res.status(401).json({ ok: false, error: "Formato inválido" });
    }

    const user = decoded.substring(0, separatorIndex);
    const pass = decoded.substring(separatorIndex + 1);

    if (user === ADMIN_USER && pass === ADMIN_PASS && ADMIN_USER) {
      return next();
    }

    return res.status(401).json({ ok: false, error: "Credenciales incorrectas" });

  } catch (err) {
    return res.status(401).json({ ok: false, error: "Error de autenticación" });
  }
};