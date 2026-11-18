# Módulo 4: Predicación — Especificación Funcional

## 1. Objetivo y Problema que Resuelve
Permitir a pastores y predicadores proyectar sus sermones y presentaciones preparadas (PDF y PowerPoint), avanzando y retrocediendo diapositivas con fluidez, con la capacidad crítica de **alternar a la lectura bíblica en vivo (`Ctrl + T`) y regresar a la presentación exactamente en la misma diapositiva** sin que la congregación note la transición ni vea búsquedas.

## 2. Formatos Soportados y Límites de Compatibilidad
- **Formato Recomendado — PDF:**
  - Máxima fidelidad tipográfica, vectorial y gráfica.
  - Idéntica visualización en cualquier equipo o proyector sin depender de software de terceros.
- **Formato PowerPoint (.pptx):**
  - Admite importación de presentaciones de diapositivas estándar.
  - *Límites Técnicos Honestos:* Las transiciones tridimensionales complejas, animaciones automáticas por tiempo y macros de Microsoft Office no son reproducibles nativamente en navegadores sin Office instalado. BIBLE extrae las diapositivas como imágenes de alta resolución para garantizar estabilidad absoluta y cero cuelgues durante el culto.

## 3. Integración Fluida con la Biblia (Bible Switch)
1. El predicador está en la diapositiva 12.
2. Dice: *"Hermanos, abramos nuestras Biblias en Romanos 8:28"*.
3. El operador pulsa `Ctrl + T` (la pantalla congregacional sigue mostrando la diapositiva 12).
4. El operador escribe `ro 8:28` y presiona `Enter`.
5. La pantalla congregacional pasa al versículo de Romanos 8:28.
6. El predicador termina de leer y continúa su sermón.
7. El operador regresa al módulo Predicación.
8. La presentación reanuda instantáneamente en la diapositiva 12 sin reiniciarse.

## 4. Funcionalidades del Operador
- Explorador e importador local de presentaciones.
- Mosaico de diapositivas con numeración y vista previa en miniatura.
- Controles de avance: `Flecha Derecha` (Siguiente), `Flecha Izquierda` (Anterior).
- Indicador visual de diapositiva proyectada en vivo.
- Pausa y reanudación de la presentación.
