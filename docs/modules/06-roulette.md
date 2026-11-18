# Módulo 6: Ruleta — Especificación Funcional

## 1. Objetivo y Problema que Resuelve
Proporcionar una dinámica visual interactiva, colorida y transparente para sorteos, rifas pro-templo, dinámicas bíblicas en escuelas dominicales, campamentos, preguntas bíblicas y distribución de participaciones durante las actividades de la iglesia.
Permite proyectar el giro de la ruleta y el resultado ganador de manera sincronizada en la pantalla congregacional.

## 2. Gestión de Listas y Elementos
- **Creación de Listas:** Permite guardar diferentes listas temáticas (ej. *Escuela Dominical*, *Sorteo Pro-Templo*, *Preguntas Bíblicas*, *Sociedad de Damas*).
- **Tipos de Elementos:**
  - Números (con generador rápido de rangos: del 1 al 10, del 1 al 50, del 1 al 100).
  - Letras / Nombres de personas o grupos.
  - Texto personalizado de premios o preguntas bíblicas.
- **Edición y Limpieza:** Agregar, editar o eliminar elementos individuales en cualquier momento.

## 3. Física de Giro y Proyección Sincronizada
- Motor de renderizado en `<canvas>` con física de aceleración y desaceleración suave (curva cúbica con fricción angular).
- Cálculo determinista del elemento ganador en el ángulo de parada del puntero superior.
- **Sincronización en Pantalla Pública:**
  - Al presionar **[GIRAR]** o la barra espaciadora, la pantalla pública inicia el giro simultáneamente.
  - Al detenerse, se muestra un banner de felicitación con el elemento ganador en alta visibilidad.
- Atajo de teclado: `Ctrl + R`.
