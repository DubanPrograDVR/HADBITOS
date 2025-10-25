// ============================================================================
// ESTADO DE LA APLICACIÓN
// ============================================================================

let habitos = [];
let habitoEnEdicion = null;
let habitoAEliminar = null;

// ============================================================================
// FUNCIONES DE ALMACENAMIENTO (LocalStorage)
// ============================================================================

const guardarHabitos = () => {
  localStorage.setItem("misHabitosApp", JSON.stringify(habitos));
};

const cargarHabitos = () => {
  const datosGuardados = localStorage.getItem("misHabitosApp");
  if (datosGuardados) {
    habitos = JSON.parse(datosGuardados);
  }
};

// ============================================================================
// FUNCIONES DE INTERFAZ - ESTADÍSTICAS
// ============================================================================

const actualizarEstadisticas = () => {
  const totalHabitos = habitos.length;
  const habitosCompletados = habitos.filter(habito => habito.completadoHoy).length;
  
  const elementoTotalHabitos = document.getElementById('total-habitos');
  const elementoCompletados = document.getElementById('total-completados');
  
  if (elementoTotalHabitos) elementoTotalHabitos.textContent = totalHabitos;
  if (elementoCompletados) elementoCompletados.textContent = habitosCompletados;
};

// ============================================================================
// FUNCIONES DE CREACIÓN DE ELEMENTOS
// ============================================================================

const crearBoton = (clase, icono, titulo) => {
  const boton = document.createElement('button');
  boton.className = `btn-accion ${clase}`;
  boton.innerHTML = icono;
  boton.title = titulo;
  return boton;
};

const crearElementosHabito = (habito) => {
  // Contenedor principal del contenido
  const contenedorContenido = document.createElement('div');
  contenedorContenido.className = 'habito-contenido';
  
  // Nombre del hábito (span)
  const nombreSpan = document.createElement('span');
  nombreSpan.className = 'habito-nombre';
  nombreSpan.textContent = habito.nombre;
  
  // Input para edición
  const inputEditar = document.createElement('input');
  inputEditar.type = 'text';
  inputEditar.className = 'habito-input-editar';
  inputEditar.value = habito.nombre;
  
  contenedorContenido.appendChild(nombreSpan);
  contenedorContenido.appendChild(inputEditar);
  
  return { contenedorContenido, nombreSpan, inputEditar };
};

const crearBotonesAccion = (habito) => {
  const contenedorAcciones = document.createElement('div');
  contenedorAcciones.className = 'habito-acciones';
  
  // Botón de completar/check
  const iconoCheck = habito.completadoHoy 
    ? '<i class="fas fa-check-circle"></i>' 
    : '<i class="far fa-circle"></i>';
  const botonCheck = crearBoton('btn-check', iconoCheck, 'Marcar como completado');
  if (habito.completadoHoy) {
    botonCheck.classList.add('completado');
  }
  
  // Botones de acción
  const botonEditar = crearBoton('btn-editar', '<i class="fas fa-edit"></i>', 'Editar hábito');
  const botonGuardar = crearBoton('btn-guardar', '<i class="fas fa-save"></i>', 'Guardar cambios');
  const botonCancelar = crearBoton('btn-cancelar', '<i class="fas fa-times"></i>', 'Cancelar edición');
  const botonEliminar = crearBoton('btn-eliminar', '<i class="fas fa-trash"></i>', 'Eliminar hábito');
  
  // Agregar botones al contenedor
  contenedorAcciones.appendChild(botonCheck);
  contenedorAcciones.appendChild(botonEditar);
  contenedorAcciones.appendChild(botonGuardar);
  contenedorAcciones.appendChild(botonCancelar);
  contenedorAcciones.appendChild(botonEliminar);
  
  return {
    contenedorAcciones,
    botonCheck,
    botonEditar,
    botonGuardar,
    botonCancelar,
    botonEliminar
  };
};

const configurarEventosHabito = (habito, elementos, botones) => {
  const { nombreSpan, inputEditar } = elementos;
  const { botonCheck, botonEditar, botonGuardar, botonCancelar, botonEliminar } = botones;
  
  // Evento: Marcar como completado
  botonCheck.addEventListener('click', (evento) => {
    evento.stopPropagation();
    alternarEstadoCompletado(habito.id);
  });
  
  // Evento: Iniciar edición
  botonEditar.addEventListener('click', (evento) => {
    evento.stopPropagation();
    iniciarEdicion(habito.id, nombreSpan, inputEditar, botonEditar, botonEliminar, botonGuardar, botonCancelar);
  });
  
  // Evento: Guardar edición
  botonGuardar.addEventListener('click', (evento) => {
    evento.stopPropagation();
    guardarEdicion(habito.id, inputEditar.value, nombreSpan, inputEditar, botonEditar, botonEliminar, botonGuardar, botonCancelar);
  });
  
  // Evento: Cancelar edición
  botonCancelar.addEventListener('click', (evento) => {
    evento.stopPropagation();
    cancelarEdicion(nombreSpan, inputEditar, botonEditar, botonEliminar, botonGuardar, botonCancelar);
  });
  
  // Evento: Eliminar hábito
  botonEliminar.addEventListener('click', (evento) => {
    evento.stopPropagation();
    mostrarModalEliminar(habito.id, habito.nombre);
  });
  
  // Evento: Guardar con Enter
  inputEditar.addEventListener('keypress', (evento) => {
    if (evento.key === 'Enter') {
      guardarEdicion(habito.id, inputEditar.value, nombreSpan, inputEditar, botonEditar, botonEliminar, botonGuardar, botonCancelar);
    }
  });
};

// ============================================================================
// FUNCIÓN PRINCIPAL DE RENDERIZADO
// ============================================================================

const renderizarHabitos = () => {
  const contenedor = document.querySelector("#lista-de-habitos");
  const estadoVacio = document.getElementById('estado-vacio');
  
  if (!contenedor) return;
  
  contenedor.innerHTML = "";
  
  // Mostrar/ocultar mensaje de lista vacía
  if (habitos.length === 0) {
    if (estadoVacio) estadoVacio.classList.add('show');
    actualizarEstadisticas();
    return;
  } else {
    if (estadoVacio) estadoVacio.classList.remove('show');
  }
  
  // Renderizar cada hábito
  habitos.forEach((habito) => {
    const itemLista = document.createElement("li");
    itemLista.dataset.id = habito.id;
    
    // Crear elementos del hábito
    const elementos = crearElementosHabito(habito);
    const botones = crearBotonesAccion(habito);
    
    // Configurar eventos
    configurarEventosHabito(habito, elementos, botones);
    
    // Ensamblar el item
    itemLista.appendChild(elementos.contenedorContenido);
    itemLista.appendChild(botones.contenedorAcciones);
    
    // Marcar como completado si corresponde
    if (habito.completadoHoy) {
      itemLista.classList.add("habito-completado");
    }
    
    contenedor.appendChild(itemLista);
  });
  
  actualizarEstadisticas();
};

// ============================================================================
// FUNCIONES DE GESTIÓN DE HÁBITOS - AGREGAR
// ============================================================================

const agregarNuevoHabito = (nombreHabito) => {
  const nuevoHabito = {
    id: Date.now(),
    nombre: nombreHabito,
    completadoHoy: false,
    fechaCreacion: new Date().toISOString(),
  };

  habitos.push(nuevoHabito);
  guardarHabitos();
  renderizarHabitos();
};

const mostrarFeedbackExito = (elemento) => {
  elemento.style.borderColor = 'var(--verde-principal)';
  setTimeout(() => {
    elemento.style.borderColor = 'transparent';
  }, 1000);
};

const inicializarFormulario = () => {
  const formulario = document.querySelector("#formulario-nuevo-habito");
  
  if (!formulario) return;
  
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    
    const inputNombre = document.querySelector("#nombre-habito");
    const nombreHabito = inputNombre.value.trim();
    
    if (nombreHabito) {
      agregarNuevoHabito(nombreHabito);
      inputNombre.value = "";
      mostrarFeedbackExito(inputNombre);
    }
  });
};

// ============================================================================
// FUNCIONES DE GESTIÓN DE HÁBITOS - EDITAR
// ============================================================================

const cancelarEdicionPrevia = () => {
  if (!habitoEnEdicion) return;
  
  const itemAnterior = document.querySelector(`li[data-id="${habitoEnEdicion}"]`);
  if (!itemAnterior) return;
  
  const nombreSpan = itemAnterior.querySelector('.habito-nombre');
  const inputEditar = itemAnterior.querySelector('.habito-input-editar');
  const botonEditar = itemAnterior.querySelector('.btn-editar');
  const botonEliminar = itemAnterior.querySelector('.btn-eliminar');
  const botonGuardar = itemAnterior.querySelector('.btn-guardar');
  const botonCancelar = itemAnterior.querySelector('.btn-cancelar');
  
  cancelarEdicion(nombreSpan, inputEditar, botonEditar, botonEliminar, botonGuardar, botonCancelar);
};

const toggleModoEdicion = (nombreSpan, inputEditar, botonEditar, botonEliminar, botonGuardar, botonCancelar, activar) => {
  if (activar) {
    nombreSpan.classList.add('editando');
    inputEditar.classList.add('activo');
    inputEditar.focus();
    inputEditar.select();
    
    botonEditar.style.display = 'none';
    botonEliminar.style.display = 'none';
    botonGuardar.classList.add('activo');
    botonCancelar.classList.add('activo');
  } else {
    nombreSpan.classList.remove('editando');
    inputEditar.classList.remove('activo');
    
    botonEditar.style.display = 'flex';
    botonEliminar.style.display = 'flex';
    botonGuardar.classList.remove('activo');
    botonCancelar.classList.remove('activo');
  }
};

const iniciarEdicion = (id, nombreSpan, inputEditar, botonEditar, botonEliminar, botonGuardar, botonCancelar) => {
  if (habitoEnEdicion && habitoEnEdicion !== id) {
    cancelarEdicionPrevia();
  }
  
  habitoEnEdicion = id;
  toggleModoEdicion(nombreSpan, inputEditar, botonEditar, botonEliminar, botonGuardar, botonCancelar, true);
};

const guardarEdicion = (id, nuevoNombre, nombreSpan, inputEditar, botonEditar, botonEliminar, botonGuardar, botonCancelar) => {
  const nombreLimpio = nuevoNombre.trim();
  
  if (!nombreLimpio) {
    alert('El nombre del hábito no puede estar vacío');
    inputEditar.focus();
    return;
  }
  
  const indiceHabito = habitos.findIndex(habito => habito.id === id);
  
  if (indiceHabito !== -1) {
    habitos[indiceHabito].nombre = nombreLimpio;
    guardarHabitos();
    nombreSpan.textContent = nombreLimpio;
    cancelarEdicion(nombreSpan, inputEditar, botonEditar, botonEliminar, botonGuardar, botonCancelar);
    
    // Feedback visual
    const itemLista = document.querySelector(`li[data-id="${id}"]`);
    if (itemLista) {
      mostrarFeedbackExito(itemLista);
    }
  }
  
  habitoEnEdicion = null;
};

const cancelarEdicion = (nombreSpan, inputEditar, botonEditar, botonEliminar, botonGuardar, botonCancelar) => {
  const id = inputEditar.closest('li').dataset.id;
  const habito = habitos.find(h => h.id == id);
  
  if (habito) {
    inputEditar.value = habito.nombre;
  }
  
  toggleModoEdicion(nombreSpan, inputEditar, botonEditar, botonEliminar, botonGuardar, botonCancelar, false);
  habitoEnEdicion = null;
};

// ============================================================================
// FUNCIONES DE GESTIÓN DE HÁBITOS - ELIMINAR
// ============================================================================

const mostrarModalEliminar = (id, nombreHabito) => {
  habitoAEliminar = id;
  
  const modal = document.getElementById('modal-eliminar');
  const elementoNombre = document.getElementById('nombre-habito-eliminar');
  
  if (modal && elementoNombre) {
    elementoNombre.textContent = `"${nombreHabito}"`;
    modal.classList.add('show');
  }
};

const cerrarModalEliminar = () => {
  const modal = document.getElementById('modal-eliminar');
  
  if (modal) {
    modal.classList.remove('show');
  }
  
  habitoAEliminar = null;
};

const confirmarEliminarHabito = () => {
  if (habitoAEliminar === null) return;
  
  habitos = habitos.filter(habito => habito.id !== habitoAEliminar);
  guardarHabitos();
  renderizarHabitos();
  cerrarModalEliminar();
};

const inicializarModalEliminar = () => {
  const botonConfirmar = document.getElementById('btn-confirmar-eliminar');
  const botonCancelar = document.getElementById('btn-cancelar-eliminar');
  const modal = document.getElementById('modal-eliminar');
  
  if (botonConfirmar) {
    botonConfirmar.addEventListener('click', confirmarEliminarHabito);
  }
  
  if (botonCancelar) {
    botonCancelar.addEventListener('click', cerrarModalEliminar);
  }
  
  if (modal) {
    modal.addEventListener('click', (evento) => {
      if (evento.target === modal) {
        cerrarModalEliminar();
      }
    });
  }
  
  // Cerrar con tecla Escape
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') {
      cerrarModalEliminar();
    }
  });
};

// ============================================================================
// FUNCIONES DE GESTIÓN DE HÁBITOS - COMPLETAR
// ============================================================================

const alternarEstadoCompletado = (id) => {
  const indiceHabito = habitos.findIndex(habito => habito.id === id);
  
  if (indiceHabito === -1) return;
  
  habitos[indiceHabito].completadoHoy = !habitos[indiceHabito].completadoHoy;
  
  if (habitos[indiceHabito].completadoHoy) {
    habitos[indiceHabito].fechaCompletado = new Date().toISOString();
  }
  
  guardarHabitos();
  renderizarHabitos();
};

// ============================================================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================================================

const inicializarApp = () => {
  cargarHabitos();
  renderizarHabitos();
  inicializarFormulario();
  inicializarModalEliminar();
};

// Ejecutar cuando el DOM esté listo
inicializarApp();
