// ============================================================================
// FUNCIONALIDAD DE LA PÁGINA DE LOGIN
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  inicializarLogin();
});

const inicializarLogin = () => {
  configurarTogglePassword();
  configurarFormularioLogin();
  configurarBotonesSociales();
};

// ============================================================================
// TOGGLE PASSWORD (Mostrar/Ocultar Contraseña)
// ============================================================================

const configurarTogglePassword = () => {
  const botonToggle = document.getElementById('toggle-password');
  const inputPassword = document.getElementById('password');
  
  if (!botonToggle || !inputPassword) return;
  
  botonToggle.addEventListener('click', () => {
    const tipo = inputPassword.type === 'password' ? 'text' : 'password';
    inputPassword.type = tipo;
    
    const icono = botonToggle.querySelector('i');
    icono.className = tipo === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
  });
};

// ============================================================================
// FORMULARIO DE LOGIN
// ============================================================================

const configurarFormularioLogin = () => {
  const formulario = document.getElementById('form-login');
  
  if (!formulario) return;
  
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const recordar = document.getElementById('remember').checked;
    
    // Validación básica
    if (!validarEmail(email)) {
      mostrarMensaje('Por favor, ingresa un correo electrónico válido', 'error');
      return;
    }
    
    if (password.length < 6) {
      mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }
    
    // Simular inicio de sesión
    iniciarSesion(email, password, recordar);
  });
};

const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const iniciarSesion = (email, password, recordar) => {
  // Aquí iría la lógica real de autenticación
  // Por ahora, simulamos un inicio de sesión exitoso
  
  const botonLogin = document.querySelector('.btn-login');
  const textoOriginal = botonLogin.innerHTML;
  
  // Mostrar estado de carga
  botonLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
  botonLogin.disabled = true;
  
  setTimeout(() => {
    // Guardar información de sesión simulada
    const usuario = {
      email: email,
      nombre: 'Usuario Demo',
      fechaLogin: new Date().toISOString()
    };
    
    localStorage.setItem('usuarioActual', JSON.stringify(usuario));
    
    if (recordar) {
      localStorage.setItem('recordarSesion', 'true');
    }
    
    mostrarMensaje('¡Inicio de sesión exitoso!', 'success');
    
    // Redirigir a la página de hábitos
    setTimeout(() => {
      window.location.href = './agregarhabito.html';
    }, 1000);
  }, 1500);
};

// ============================================================================
// BOTONES DE LOGIN SOCIAL
// ============================================================================

const configurarBotonesSociales = () => {
  const botonGoogle = document.querySelector('.btn-google');
  const botonFacebook = document.querySelector('.btn-facebook');
  
  if (botonGoogle) {
    botonGoogle.addEventListener('click', () => {
      mostrarMensaje('Inicio de sesión con Google (Funcionalidad en desarrollo)', 'info');
    });
  }
  
  if (botonFacebook) {
    botonFacebook.addEventListener('click', () => {
      mostrarMensaje('Inicio de sesión con Facebook (Funcionalidad en desarrollo)', 'info');
    });
  }
};

// ============================================================================
// MENSAJES DE FEEDBACK
// ============================================================================

const mostrarMensaje = (mensaje, tipo = 'info') => {
  // Eliminar mensaje anterior si existe
  const mensajeAnterior = document.querySelector('.mensaje-feedback');
  if (mensajeAnterior) {
    mensajeAnterior.remove();
  }
  
  const div = document.createElement('div');
  div.className = `mensaje-feedback mensaje-${tipo}`;
  div.innerHTML = `
    <i class="fas ${obtenerIconoMensaje(tipo)}"></i>
    <span>${mensaje}</span>
  `;
  
  const loginBody = document.querySelector('.login-body');
  loginBody.insertBefore(div, loginBody.firstChild);
  
  // Eliminar mensaje después de 5 segundos
  setTimeout(() => {
    div.style.opacity = '0';
    setTimeout(() => div.remove(), 300);
  }, 5000);
};

const obtenerIconoMensaje = (tipo) => {
  const iconos = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle',
    warning: 'fa-exclamation-triangle'
  };
  return iconos[tipo] || iconos.info;
};

// ============================================================================
// VERIFICAR SESIÓN ACTIVA
// ============================================================================

const verificarSesionActiva = () => {
  const usuarioActual = localStorage.getItem('usuarioActual');
  const recordarSesion = localStorage.getItem('recordarSesion');
  
  if (usuarioActual && recordarSesion === 'true') {
    // Si hay sesión activa, redirigir a la página de hábitos
    window.location.href = './agregarhabito.html';
  }
};

// Verificar sesión al cargar la página
verificarSesionActiva();
