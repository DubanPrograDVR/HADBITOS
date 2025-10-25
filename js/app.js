let habitos = [];
let habitoAEliminar = null;
let habitoEnEdicion = null;

// Actualizar estadísticas
const actualizarEstadisticas = () => {
  const totalHabitos = habitos.length;
  const completadosHoy = habitos.filter(h => h.completadoHoy).length;
  
  const totalHabitosEl = document.getElementById('total-habitos');
  const totalCompletadosEl = document.getElementById('total-completados');
  
  if (totalHabitosEl) totalHabitosEl.textContent = totalHabitos;
  if (totalCompletadosEl) totalCompletadosEl.textContent = completadosHoy;
};

const renderizar_habito = () => {
  const contenedor = document.querySelector("#lista-de-habitos");
  const estadoVacio = document.getElementById('estado-vacio');
  
  if (!contenedor) return;
  
  contenedor.innerHTML = "";
  
  // Mostrar/ocultar estado vacío
  if (habitos.length === 0) {
    if (estadoVacio) estadoVacio.classList.add('show');
    actualizarEstadisticas();
    return;
  } else {
    if (estadoVacio) estadoVacio.classList.remove('show');
  }
  
  habitos.forEach((habito) => {
    const li = document.createElement("li");
    li.dataset.id = habito.id;
    
    // Contenedor del contenido del hábito
    const habitoContenido = document.createElement('div');
    habitoContenido.className = 'habito-contenido';
    
    // Nombre del hábito (texto normal)
    const nombreSpan = document.createElement('span');
    nombreSpan.className = 'habito-nombre';
    nombreSpan.textContent = habito.nombre;
    
    // Input para editar (oculto por defecto)
    const inputEditar = document.createElement('input');
    inputEditar.type = 'text';
    inputEditar.className = 'habito-input-editar';
    inputEditar.value = habito.nombre;
    
    habitoContenido.appendChild(nombreSpan);
    habitoContenido.appendChild(inputEditar);
    
    // Contenedor de acciones
    const accionesDiv = document.createElement('div');
    accionesDiv.className = 'habito-acciones';
    
    // Botón de check/completar
    const btnCheck = document.createElement('button');
    btnCheck.className = 'btn-accion btn-check';
    btnCheck.innerHTML = habito.completadoHoy ? '<i class="fas fa-check-circle"></i>' : '<i class="far fa-circle"></i>';
    btnCheck.title = 'Marcar como completado';
    if (habito.completadoHoy) {
      btnCheck.classList.add('completado');
    }
    
    // Botón de editar
    const btnEditar = document.createElement('button');
    btnEditar.className = 'btn-accion btn-editar';
    btnEditar.innerHTML = '<i class="fas fa-edit"></i>';
    btnEditar.title = 'Editar hábito';
    
    // Botón de eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn-accion btn-eliminar';
    btnEliminar.innerHTML = '<i class="fas fa-trash"></i>';
    btnEliminar.title = 'Eliminar hábito';
    
    // Botón de guardar edición (oculto por defecto)
    const btnGuardar = document.createElement('button');
    btnGuardar.className = 'btn-accion btn-guardar';
    btnGuardar.innerHTML = '<i class="fas fa-save"></i>';
    btnGuardar.title = 'Guardar cambios';
    
    // Botón de cancelar edición (oculto por defecto)
    const btnCancelar = document.createElement('button');
    btnCancelar.className = 'btn-accion btn-cancelar';
    btnCancelar.innerHTML = '<i class="fas fa-times"></i>';
    btnCancelar.title = 'Cancelar edición';
    
    // Agregar botones a acciones
    accionesDiv.appendChild(btnCheck);
    accionesDiv.appendChild(btnEditar);
    accionesDiv.appendChild(btnGuardar);
    accionesDiv.appendChild(btnCancelar);
    accionesDiv.appendChild(btnEliminar);
    
    // Agregar contenido y acciones al li
    li.appendChild(habitoContenido);
    li.appendChild(accionesDiv);

    if (habito.completadoHoy === true) {
      li.classList.add("habito-completado");
    }
    
    // Evento para marcar como completado
    btnCheck.addEventListener('click', (e) => {
      e.stopPropagation();
      alternarCompletado(parseInt(habito.id));
    });
    
    // Evento para editar
    btnEditar.addEventListener('click', (e) => {
      e.stopPropagation();
      iniciarEdicion(habito.id, nombreSpan, inputEditar, btnEditar, btnEliminar, btnGuardar, btnCancelar);
    });
    
    // Evento para eliminar
    btnEliminar.addEventListener('click', (e) => {
      e.stopPropagation();
      mostrarModalEliminar(habito.id, habito.nombre);
    });
    
    // Evento para guardar edición
    btnGuardar.addEventListener('click', (e) => {
      e.stopPropagation();
      guardarEdicion(habito.id, inputEditar.value, nombreSpan, inputEditar, btnEditar, btnEliminar, btnGuardar, btnCancelar);
    });
    
    // Evento para cancelar edición
    btnCancelar.addEventListener('click', (e) => {
      e.stopPropagation();
      cancelarEdicion(nombreSpan, inputEditar, btnEditar, btnEliminar, btnGuardar, btnCancelar);
    });
    
    // Permitir guardar con Enter en el input
    inputEditar.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        guardarEdicion(habito.id, inputEditar.value, nombreSpan, inputEditar, btnEditar, btnEliminar, btnGuardar, btnCancelar);
      }
    });

    contenedor.appendChild(li);
  });
  
  actualizarEstadisticas();
};

const formulario = document.querySelector("#formulario-nuevo-habito");

if (formulario) {
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const inputNombre = document.querySelector("#nombre-habito");
    const nombre = inputNombre.value.trim();
    if (nombre) {
      const nuevoHabito = {
        id: Date.now(),
        nombre: nombre,
        completadoHoy: false,
        fechaCreacion: new Date().toISOString(),
      };

      habitos.push(nuevoHabito);
      guardarHabitos();
      renderizar_habito();
      inputNombre.value = "";
      
      // Animación de éxito
      inputNombre.style.borderColor = 'var(--verde-principal)';
      setTimeout(() => {
        inputNombre.style.borderColor = 'transparent';
      }, 1000);
    }
  });
}

// Funciones para editar hábitos
const iniciarEdicion = (id, nombreSpan, inputEditar, btnEditar, btnEliminar, btnGuardar, btnCancelar) => {
  // Cancelar cualquier edición previa
  if (habitoEnEdicion && habitoEnEdicion !== id) {
    const liAnterior = document.querySelector(`li[data-id="${habitoEnEdicion}"]`);
    if (liAnterior) {
      const spanAnterior = liAnterior.querySelector('.habito-nombre');
      const inputAnterior = liAnterior.querySelector('.habito-input-editar');
      const btnEditarAnterior = liAnterior.querySelector('.btn-editar');
      const btnEliminarAnterior = liAnterior.querySelector('.btn-eliminar');
      const btnGuardarAnterior = liAnterior.querySelector('.btn-guardar');
      const btnCancelarAnterior = liAnterior.querySelector('.btn-cancelar');
      
      cancelarEdicion(spanAnterior, inputAnterior, btnEditarAnterior, btnEliminarAnterior, btnGuardarAnterior, btnCancelarAnterior);
    }
  }
  
  habitoEnEdicion = id;
  
  // Ocultar nombre y mostrar input
  nombreSpan.classList.add('editando');
  inputEditar.classList.add('activo');
  inputEditar.focus();
  inputEditar.select();
  
  // Ocultar botones de editar y eliminar
  btnEditar.style.display = 'none';
  btnEliminar.style.display = 'none';
  
  // Mostrar botones de guardar y cancelar
  btnGuardar.classList.add('activo');
  btnCancelar.classList.add('activo');
};

const guardarEdicion = (id, nuevoNombre, nombreSpan, inputEditar, btnEditar, btnEliminar, btnGuardar, btnCancelar) => {
  const nombreTrim = nuevoNombre.trim();
  
  if (nombreTrim === '') {
    alert('El nombre del hábito no puede estar vacío');
    inputEditar.focus();
    return;
  }
  
  // Buscar y actualizar el hábito
  const habitoIndex = habitos.findIndex(h => h.id === id);
  if (habitoIndex !== -1) {
    habitos[habitoIndex].nombre = nombreTrim;
    guardarHabitos();
    
    // Actualizar el texto
    nombreSpan.textContent = nombreTrim;
    
    // Salir del modo edición
    cancelarEdicion(nombreSpan, inputEditar, btnEditar, btnEliminar, btnGuardar, btnCancelar);
    
    // Feedback visual
    const li = document.querySelector(`li[data-id="${id}"]`);
    if (li) {
      li.style.borderColor = 'var(--verde-principal)';
      setTimeout(() => {
        li.style.borderColor = 'transparent';
      }, 1000);
    }
  }
  
  habitoEnEdicion = null;
};

const cancelarEdicion = (nombreSpan, inputEditar, btnEditar, btnEliminar, btnGuardar, btnCancelar) => {
  // Restaurar el input al valor original
  const id = inputEditar.closest('li').dataset.id;
  const habito = habitos.find(h => h.id == id);
  if (habito) {
    inputEditar.value = habito.nombre;
  }
  
  // Mostrar nombre y ocultar input
  nombreSpan.classList.remove('editando');
  inputEditar.classList.remove('activo');
  
  // Mostrar botones de editar y eliminar
  btnEditar.style.display = 'flex';
  btnEliminar.style.display = 'flex';
  
  // Ocultar botones de guardar y cancelar
  btnGuardar.classList.remove('activo');
  btnCancelar.classList.remove('activo');
  
  habitoEnEdicion = null;
};

// Funciones para eliminar hábitos
const mostrarModalEliminar = (id, nombre) => {
  habitoAEliminar = id;
  const modal = document.getElementById('modal-eliminar');
  const nombreHabito = document.getElementById('nombre-habito-eliminar');
  
  if (modal && nombreHabito) {
    nombreHabito.textContent = `"${nombre}"`;
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

const eliminarHabito = () => {
  if (habitoAEliminar !== null) {
    habitos = habitos.filter(h => h.id !== habitoAEliminar);
    guardarHabitos();
    renderizar_habito();
    cerrarModalEliminar();
    
    // Mostrar feedback
    console.log('Hábito eliminado correctamente');
  }
};

// Event listeners para el modal
const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
const btnCancelarEliminar = document.getElementById('btn-cancelar-eliminar');
const modalOverlay = document.getElementById('modal-eliminar');

if (btnConfirmarEliminar) {
  btnConfirmarEliminar.addEventListener('click', eliminarHabito);
}

if (btnCancelarEliminar) {
  btnCancelarEliminar.addEventListener('click', cerrarModalEliminar);
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      cerrarModalEliminar();
    }
  });
}

// Cerrar modal con tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    cerrarModalEliminar();
  }
});

const alternarCompletado = (id) => {
  // 1. Recorremos el array para encontrar el hábito por su ID
  const habitoIndex = habitos.findIndex((habito) => habito.id === id);

  if (habitoIndex !== -1) {
    // 2. Invertir el valor booleano 'completadoHoy'
    habitos[habitoIndex].completadoHoy = !habitos[habitoIndex].completadoHoy;

    // 3. Actualizar fecha si se completó
    if (habitos[habitoIndex].completadoHoy) {
      habitos[habitoIndex].fechaCompletado = new Date().toISOString();
    }

    // 4. Persistencia: Guardar el cambio inmediatamente
    guardarHabitos();

    // 5. Actualizar la interfaz para que se refleje la clase CSS
    renderizar_habito();
  }
};

const guardarHabitos = () => {
  // JSON.stringify() convierte el array de JS en una cadena
  localStorage.setItem("misHabitosApp", JSON.stringify(habitos));
};

const cargarHabitos = () => {
  const dataGuardada = localStorage.getItem("misHabitosApp");

  // Si hay datos, los parseamos (convertimos la cadena JSON de vuelta a array de JS)
  if (dataGuardada) {
    // Esto sobreescribe tu array inicial
    habitos = JSON.parse(dataGuardada);
  }
};

// Cargar hábitos al iniciar
cargarHabitos();
renderizar_habito();
