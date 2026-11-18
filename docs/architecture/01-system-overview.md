# BIBLE — Documento de Arquitectura General

## 1. Visión General de la Arquitectura

BIBLE se basa en el modelo de separación de procesos de Electron, aplicando el principio de mínimo privilegio y máxima estabilidad de proyección.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ELECTRON MAIN PROCESS                           │
│  - Ciclo de vida de la aplicación                                      │
│  - Detección de pantallas HDMI / Displays                              │
│  - Gestor de Ventanas (Operador + Ventana Pública)                     │
│  - Motor de Proyección Central (Máquina de Estados de Emisión)         │
│  - Persistencia SQLite (WAL mode) & Repositorios de datos              │
│  - Protocolo Seguro Local ('bible-media://')                           │
│  - Sistema de Respaldos Integrales (.bible-backup)                     │
└──────────────┬──────────────────────────────────────────┬──────────────┘
               │ IPC Seguro (Canales Validados)           │ IPC Seguro (Eventos de Emisión)
               ▼                                          ▼
┌──────────────────────────────┐          ┌──────────────────────────────┐
│       OPERATOR WINDOW        │          │        PUBLIC WINDOW         │
│  (src/renderer/modules/)     │          │  (src/renderer/projection/)  │
│  - Panel de control          │          │  - Salida HDMI a proyector   │
│  - Búsqueda en vivo          │          │  - Cero controles visibles   │
│  - Previsualización 16:9     │          │  - Renderizado pasivo        │
│  - Botones de pánico         │          │  - Tipografía fluida         │
└──────────────────────────────┘          └──────────────────────────────┘
```

---

## 2. Los Dos Contextos de Ventana

### 2.1. Ventana del Operador (`OperatorWindow`)
- **Propósito:** Espacio de trabajo exclusivo para el operador en el monitor principal.
- **Propiedades de ventana:** Con marco (`frame: true`), tamaño adaptable, barra de título y panel redimensionable.
- **Comportamiento:** El operador puede cambiar de pestañas, buscar versículos, escribir o navegar entre módulos sin que ninguna de estas acciones afecte la pantalla pública hasta pulsar `Enter` o el botón de proyectar.

### 2.2. Ventana Pública (`PublicWindow`)
- **Propósito:** Mostrar únicamente el contenido aprobado a la congregación en el monitor secundario/proyector HDMI.
- **Propiedades de ventana:**
  - Sin marco (`frame: false`).
  - Sin barra de tareas (`skipTaskbar: true` cuando esté activa).
  - En pantalla completa sobre las coordenadas físicas del display secundario (`x`, `y`, `width`, `height`).
- **Independencia:** Si la ventana del operador se minimiza, se congela o cambia de pestaña, la ventana pública conserva la última imagen proyectada sin parpadeos ni desconexiones.

---

## 3. Modelo de Seguridad en Electron

De acuerdo con el Prompt 4, la seguridad de Electron sigue un estándar estricto:

1. **`nodeIntegration: false`**: Las ventanas del renderer no pueden ejecutar llamadas directas al sistema operativo (sin acceso a `fs`, `child_process`, `os`, etc.).
2. **`contextIsolation: true`**: El script `preload.js` y el código del navegador residen en contextos de memoria separados para evitar la contaminación de prototipos.
3. **`sandbox: true`**: Los renderers operan en el sandbox de Chromium.
4. **API Estricta vía `contextBridge`**:
   - Se expone únicamente un objeto seguro (ej. `window.bibleAPI`) con métodos tipados y validados.
   - Toda llamada desde la interfaz al proceso principal se realiza a través de canales IPC con validación de parámetros.
5. **Protocolo Seguro de Archivos (`bible-media://`)**:
   - Los archivos locales (imágenes de la iglesia, fondos, videos) no se cargan mediante `file://` deshabilitando `webSecurity`.
   - Se implementa un protocolo personalizado en el Main Process que valida que la ruta resuelta pertenezca exclusivamente a la carpeta autorizada de la aplicación (`userData/media`), previniendo vulnerabilidades de salto de directorio (*path traversal*).

---

## 4. Motor de Proyección (State Machine)

El motor de proyección central reside en el proceso principal (`src/main/services/projection-service.js`). Funciona como una máquina de estados que gestiona:

- **Estado Actual:**
  - Tipo de contenido (`BIBLE_VERSE`, `CHORUS_SLIDE`, `MEDIA_SPOT`, `SLIDE_DECK`, `ROULETTE`, `COUNTDOWN`, `BLACKOUT`, `LOGO`).
  - Payloads de datos (texto, referencia, tipografía, fondo, índice).
  - Estado de congelación (`freeze: boolean`).
  - Estado de texto oculto (`hideText: boolean`).
- **Desacoplamiento de Módulos:**
  - Si el operador está proyectando una diapositiva de predicación (ej. diapositiva 14), cambia al módulo Biblia, busca un versículo y lo proyecta, el estado de la predicación permanece memorizado en el índice 14. Al terminar la lectura bíblica, el operador puede volver a la predicación exactamente donde quedó.

---

## 5. Estrategia de Base de Datos y Persistencia

- **Motor:** SQLite 3 nativo mediante `better-sqlite3` en el proceso principal.
- **Modo:** WAL (`Write-Ahead Logging`), que permite lecturas concurrentes sin bloqueo y resistencia ante apagones inesperados.
- **Versionado:** Tabla `_migrations` para aplicar cambios de esquema incrementales y reproducibles.
- **Patrón de Acceso:** Repositorios (`src/database/repositories/`) encargados de ejecutar consultas SQL preparadas (parametrizadas al 100%).
