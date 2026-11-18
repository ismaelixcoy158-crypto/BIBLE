# ADR-001: Selección de Pila Tecnológica y Modularidad

- **Fecha:** 2026-11-18
- **Estado:** Aprobado
- **Contexto:** Definición de la base técnica y arquitectura de BIBLE para garantizar estabilidad, rendimiento y mantenibilidad a largo plazo (5-10 años) en iglesias pentecostales.

---

## Decisión

Se adopta una pila tecnológica pura y sin dependencias superfluas:

1. **Electron:** Administrador de tiempo de ejecución de escritorio y gestor multi-monitor para Windows 11.
2. **HTML5 Semántico:** Estructura de vistas dividida por módulos independientes.
3. **CSS3 Puro:** Variables de diseño (CSS Custom Properties) para el sistema de diseño *Pro Studio Dark*, evitando preprocesadores o librerías pesadas (ej. Tailwind, Bootstrap) que añadan complejidad de compilación.
4. **JavaScript Puro (ES Modules nativos):** Modularidad nativa del lenguaje (`import` / `export`), prescindiendo de TypeScript y de frameworks frontend (como React, Angular o Vue).
5. **SQLite con `better-sqlite3`:** Base de datos local robusta, operada en modo WAL con integridad referencial y migraciones versionadas.

---

## Justificación

- **Eliminación de la deuda técnica de frameworks:** Los frameworks frontend como React o Angular sufren continuos cambios de versión que rompen compatibilidad tras pocos años. Vanilla JS con ES Modules es un estándar web permanente y compatible a perpetuidad.
- **Rendimiento instantáneo:** Sin virtual DOM ni capas intermedias de abstracción, el renderizado de texto y diapositivas es inmediato y consume una fracción de memoria RAM.
- **Offline Total:** No hay llamadas remotas de telemetría ni dependencias de CDN.
- **Aislamiento de seguridad:** El proceso principal de Node.js queda completamente separado de las ventanas de interfaz, cumpliendo con los estándares de seguridad modernos de Electron.

---

## Consecuencias

- **Positivas:**
  - Código legible, directo y fácilmente auditable.
  - Velocidad de ejecución máxima en la búsqueda en vivo y proyección.
  - Cero problemas de transpilación o empaquetado roto en el futuro.
  - Aplicación ligera y portátil para Windows 11.
- **Compromisos:**
  - La modularidad y la reactividad de la interfaz deben gestionarse mediante componentes web sencillos y buenas prácticas de manipulación del DOM nativo, lo cual requiere disciplina en la organización de carpetas y código.
