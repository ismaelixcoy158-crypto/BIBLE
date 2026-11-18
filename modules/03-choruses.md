# Módulo 3: Coritos — Especificación Funcional

## 1. Objetivo y Problema que Resuelve
Adaptar el sistema BIBLE a la dinámica viva, rápida y espontánea de los cultos pentecostales.
Permite gestionar cientos de coritos (600+), organizarlos por categorías (*Coritos Pentecostales* y *Coros de Adoración*), crear repertorios para el culto y, sobre todo, **localizar y proyectar en segundos un corito espontáneo** cuando la congregación o un hermano comienza a cantar sin previo aviso, sin que la congregación vea búsquedas ni errores en pantalla.

## 2. Categorías Principales
- **Coritos Pentecostales:** Alabanzas dinámicas, jubilosas y de fuego.
- **Coros de Adoración:** Alabanzas solemnes de ministración y comunión.
- Admite creación de categorías adicionales según las necesidades de la congregación.

## 3. Modo Espontáneo (Búsqueda Instantánea)
- **Búsqueda reactiva mientras se escribe:**
  - Búsqueda por título y por cualquier fragmento de la letra.
  - Normalización fonética (sin tildes, mayúsculas o minúsculas).
  - Resaltado visual del fragmento coincidente en los resultados.
- **Regla de Proyección:** El tecleo y la exploración son 100% privados para el operador. La pantalla pública solo se actualiza al presionar `Enter` sobre el resultado o hacer clic en "Proyectar".

## 4. Partición en Diapositivas (Slides)
- **División Automática:**
  - Divide las estrofas largas en bloques de 2 a 4 líneas por diapositiva para asegurar legibilidad a más de 30 metros.
- **División Manual:**
  - El usuario puede definir o ajustar los cortes de diapositiva utilizando saltos dobles de línea o editando las diapositivas individualmente.
- **Navegación en Culto:**
  - `Flecha Abajo` / `Flecha Arriba`: Avanza o retrocede de diapositiva en el corito activo.

## 5. Modo Repertorio (Listas de Culto)
- Creación de listas para el día (ej. *Culto Domingo Mañana*, *Vigilia de Oración*).
- Agregar, reordenar (subir/bajar) y eliminar coritos de la lista.
- Selección en un solo clic del siguiente corito planificado.

## 6. Fondos y Personalización
- 5 fondos predeterminados incluidos.
- Asignación de fondo individual por corito o uso del fondo global.
- Persistencia completa en SQLite.

