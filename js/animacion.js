// Animación de entrada para elementos
const observarElementos = () => {
  const elementos = document.querySelectorAll(
    ".elemento-fisico, .elemento, .elemento-habito, .lista-consejos li"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 100);
        }
      });
    },
    { threshold: 0.1 }
  );

  elementos.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "all 0.6s ease";
    observer.observe(el);
  });
};

// Efecto parallax suave en el header
const header = document.querySelector(".header");
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  if (scrolled > 100) {
    header.style.background = "rgba(255, 255, 255, 0.98)";
    header.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
  } else {
    header.style.background = "rgba(255, 255, 255, 0.95)";
    header.style.boxShadow =
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
  }
});

// Inicializar cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  observarElementos();
});
