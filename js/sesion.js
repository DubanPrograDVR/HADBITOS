// ========================================
// GESTIÓN DE SESIÓN DE USUARIO
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  verificarSesion();
  configurarCerrarSesion();
});

/**
 * Verifica si hay una sesión activa y actualiza la interfaz
 */
function verificarSesion() {
  const usuarioActivo = localStorage.getItem('usuarioActivo');
  const usuarioActual = localStorage.getItem('usuarioActual');
  
  if (usuarioActivo === 'true' && usuarioActual) {
    try {
      const usuario = JSON.parse(usuarioActual);
      mostrarMenuUsuario(usuario);
    } catch (error) {
      console.error('Error al cargar sesión:', error);
      cerrarSesion();
    }
  }
}

/**
 * Muestra el menú de usuario y oculta el link de login
 */
function mostrarMenuUsuario(usuario) {
  const linkLogin = document.getElementById('link-login');
  const userMenu = document.getElementById('user-menu');
  
  if (linkLogin && userMenu) {
    // Ocultar link de login
    linkLogin.style.display = 'none';
    
    // Mostrar menú de usuario
    userMenu.style.display = 'flex';
    
    // Actualizar información del usuario en el dropdown
    const userNameElements = document.querySelectorAll('.user-name');
    const userEmailElements = document.querySelectorAll('.user-email');
    
    userNameElements.forEach(el => el.textContent = usuario.nombre || 'Usuario Demo');
    userEmailElements.forEach(el => el.textContent = usuario.email || 'usuario@hadbitos.com');
  }
}

/**
 * Configura el evento de cerrar sesión
 */
function configurarCerrarSesion() {
  const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
  
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', (e) => {
      e.preventDefault();
      
      const confirmacion = confirm('¿Estás seguro de que deseas cerrar sesión?');
      
      if (confirmacion) {
        cerrarSesion();
        window.location.href = './index.html';
      }
    });
  }
}

/**
 * Cierra la sesión del usuario
 */
function cerrarSesion() {
  localStorage.removeItem('usuarioActivo');
  localStorage.removeItem('usuarioActual');
  localStorage.removeItem('recordarSesion');
  
  // Mostrar link de login nuevamente
  const linkLogin = document.getElementById('link-login');
  const userMenu = document.getElementById('user-menu');
  
  if (linkLogin && userMenu) {
    linkLogin.style.display = 'block';
    userMenu.style.display = 'none';
  }
}
