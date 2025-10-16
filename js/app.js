let habitos = [
  {
    id: 1,
    nombre: "Beber 2L de agua",
    frecuencia: "Diaria",
    completadoHoy: false,
    fechaCreacion: new Date(),
  },
  {
    id: 2,
    nombre: "Leer 15 minutos",
    frecuencia: "Diaria",
    completadoHoy: true,
    fechaCompletado: new Date(),
  },
];

const renderizar_habito = () => {
  const contenedor = document.querySelector("ul");
  contenedor.innerHTML = "";
  habitos.forEach((habito) => {
    const li = document.createElement("li");
    li.dataset.id = habito.id;
    li.textContent = habito.nombre;

    if (habito.completadoHoy === true) {
      li.classList.add("habito-completado");
    }

    contenedor.appendChild(li);
  });
};

const formulario = document.querySelector("#formulario-nuevo-habito");

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const inputNombre = document.querySelector("#nombre-habito");
  const nombre = inputNombre.value.trim();
  if (nombre) {
    const nuevoHabito = {
      id: Date.now(),
      nombre: nombre,
      completadoHoy: false,
    };

    habitos.push(nuevoHabito);

    renderizar_habito();
    inputNombre.value = "";
  }
});

const alternarCompletado = (id) => {
  // 1. Recorremos el array para encontrar el hábito por su ID
  const habitoIndex = habitos.findIndex((habito) => habito.id === id);

  if (habitoIndex !== -1) {
    // 2. Invertir el valor booleano 'completadoHoy'
    habitos[habitoIndex].completadoHoy = !habitos[habitoIndex].completadoHoy;

    // 3. Persistencia: Guardar el cambio inmediatamente
    guardarHabitos(); // Usaremos esta función en la siguiente sección

    // 4. Actualizar la interfaz para que se refleje la clase CSS
    renderizar_habito();
  }
};

const guardarHabitos = () => {
  // JSON.stringify() convierte el array de JS en una cadena
  localStorage.setItem("misHabitosApp", JSON.stringify(habitos));
  // Puedes llamar a esta función al final de: agregarHabito() y alternarCompletado()
};

const cargarHabitos = () => {
  const dataGuardada = localStorage.getItem("misHabitosApp");

  // Si hay datos, los parseamos (convertimos la cadena JSON de vuelta a array de JS)
  if (dataGuardada) {
    // Esto sobreescribe tu array inicial (que probablemente estaba vacío o con ejemplos)
    habitos = JSON.parse(dataGuardada);
  }
};

cargarHabitos();

renderizar_habito();
