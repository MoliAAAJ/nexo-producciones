import express from "express";

const router = express.Router();

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

/**
 * POST /api/auth/login
 * Valida usuario/contraseña contra variables de entorno
 */
router.post("/login", (req, res) => {
  try {
    const { usuario, password } = req.body;

    // Validar que se envíen credenciales
    if (!usuario || !password) {
      return res.status(400).json({ 
        error: "Usuario y contraseña son requeridos" 
      });
    }

    // Validar contra variables de entorno
    if (usuario === ADMIN_USER && password === ADMIN_PASS && ADMIN_USER && ADMIN_PASS) {
      console.log(`✅ Login exitoso para usuario: ${usuario}`);
      return res.json({ 
        ok: true,
        message: "Autenticación correcta"
      });
    }

    console.warn(`⚠️ Intento de login fallido para usuario: ${usuario}`);
    return res.status(401).json({ 
      error: "Usuario o contraseña incorrectos" 
    });

  } catch (error) {
    console.error("❌ Error en login:", error.message);
    res.status(500).json({ 
      error: "Error en el servidor" 
    });
  }
});

export default router;

