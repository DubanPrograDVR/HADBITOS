// ========================================
// DATOS DEL USUARIO
// ========================================

const datosUsuario = {
  nombre: "Usuario Demo",
  email: "usuario@hadbitos.com",
  telefono: "+34 123 456 789",
  ubicacion: "Madrid, España",
  miembroDesde: "Enero 2024",
  avatar: "https://ui-avatars.com/api/?name=Usuario+Demo&background=10b981&color=fff&size=256",
};

// ========================================
// CARGAR DATOS AL INICIAR
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  cargarDatosUsuario();
});

// ========================================
// FUNCIONES PRINCIPALES
// ========================================

/**
 * Carga los datos del usuario desde localStorage o usa datos por defecto
 */
function cargarDatosUsuario() {
  const usuarioGuardado = localStorage.getItem("datosUsuario");

  if (usuarioGuardado) {
    try {
      const datos = JSON.parse(usuarioGuardado);
      Object.assign(datosUsuario, datos);
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    }
  }

  // Verificar si hay sesión activa
  const usuarioActual = localStorage.getItem("usuarioActual");
  if (usuarioActual) {
    try {
      const usuario = JSON.parse(usuarioActual);
      datosUsuario.email = usuario.email || datosUsuario.email;
      datosUsuario.nombre = usuario.nombre || datosUsuario.nombre;
    } catch (error) {
      console.error("Error al cargar sesión:", error);
    }
  }

  // Actualizar la interfaz con los datos
  actualizarInterfaz();
}

/**
 * Actualiza todos los elementos de la interfaz con los datos del usuario
 */
function actualizarInterfaz() {
  // Información principal
  document.getElementById("nombre-usuario").textContent = datosUsuario.nombre;
  
  // Avatar
  const avatar = document.getElementById("avatar-principal");
  if (avatar) {
    avatar.src = datosUsuario.avatar;
  }

  // Información de contacto
  document.getElementById("email-usuario").textContent = datosUsuario.email;
  document.getElementById("telefono-usuario").textContent = datosUsuario.telefono;
  document.getElementById("ubicacion-usuario").textContent = datosUsuario.ubicacion;
  document.getElementById("fecha-registro").textContent = datosUsuario.miembroDesde;
}

