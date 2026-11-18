# BIBLE — Church Media System

Sistema de escritorio profesional, offline-first y multimedia para la proyección durante cultos y actividades en iglesias pentecostales.

---

## 1. Visión y Principios del Proyecto

- **Propósito:** Proporcionar una herramienta visualmente hermosa, confiable, intuitiva y rápida para la proyección en vivo de la Biblia, coritos, presentaciones, spots y dinámicas.
- **Filosofía Operativa:** *Offline-first*. Funciona al 100% sin conexión a Internet. Sin suscripciones, sin registros obligatorios ni recopilación de datos.
- **Rendimiento y Ergonomía:** Interfaz *Pro Studio Dark* optimizada para cabinas de proyección con iluminación tenue. Búsqueda instantánea en vivo que nunca altera la pantalla pública hasta que el operador lo autoriza.

---

## 2. Pila Tecnológica (Stack Estricto)

| Capa | Tecnología | Justificación |
| :--- | :--- | :--- |
| **Entorno de Escritorio** | **Electron** | Gestión de múltiples ventanas físicas (Operador + Monitor HDMI secundario). |
| **Estructura** | **HTML5** | Marcado semántico y desacoplado por módulo. |
| **Diseño y Estilos** | **CSS3 Puro** | Variables de diseño, ergonomía de alto contraste y animaciones fluidas sin peso de frameworks. |
| **Lógica** | **JavaScript (ES Modules)** | Modularidad nativa, sin transpilación ni sobrecarga de empaquetadores complejos. |
| **Base de Datos** | **SQLite (Modo WAL)** | Integridad transaccional local, consultas ultrarrápidas y persistencia libre de corrupción ante cortes de energía. |

*Regla:* **No React, No TypeScript, No dependencias innecesarias.**

---

## 3. Metodología de Desarrollo y Puertas de Calidad

Cada funcionalidad se desarrolla de forma incremental bajo el ciclo:
$$\text{ANALIZAR} \longrightarrow \text{DOCUMENTAR} \longrightarrow \text{DISEÑAR} \longrightarrow \text{BASE DE DATOS} \longrightarrow \text{PROGRAMAR} \longrightarrow \text{PROBAR} \longrightarrow \text{CORREGIR} \longrightarrow \text{APROBAR}$$

Ningún módulo se integra sin superar las **4 Revisiones de Calidad**:
1. **Visual:** ¿La interfaz es profesional, limpia y cómoda para el operador?
2. **Funcional:** ¿Hace exactamente lo que se definió sin fallas ni comportamientos extraños?
3. **Técnica:** ¿El código es limpio, modular, seguro y sin dependencias innecesarias?
4. **Integración:** ¿Se acopla de forma limpia con el motor de proyección y lo ya construido?

---

## 4. Estructura del Proyecto

```text
BIBLE/
├── docs/                 # Documentación técnica, arquitectura, decisiones y pruebas
├── src/
│   ├── main/             # Proceso principal de Electron (seguridad, ventanas, servicios, IPC)
│   ├── preload/          # Scripts Preload de contexto aislado (contextBridge seguro)
│   ├── renderer/         # Interfaces de usuario
│   │   ├── shared/       # Componentes y estilos globales compartidos
│   │   ├── modules/      # Módulos del operador (Biblia, Coritos, Predicación, Spots, etc.)
│   │   └── projection/   # Ventana congregacional (salida a TV/Proyector)
│   ├── database/         # Repositorios SQLite, migraciones y esquemas
│   └── assets/           # Tipografías, íconos y fondos base
├── tests/                # Pruebas unitarias, funcionales, de integración y rendimiento
└── scripts/              # Herramientas de compilación, empaquetado y mantenimiento
```

---

## 5. Entorno de Ejecución

- **Desarrollo:** Linux Mint
- **Destino de Distribución:** Windows 11 (64 bits, instalador ejecutable `.exe`)
- **Control de Versiones:** Git / GitHub
