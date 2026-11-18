# Módulo 7: Cuenta Regresiva — Especificación Funcional

## 1. Objetivo y Problema que Resuelve
Servir como reloj visual de bienvenida y aviso previo para el inicio ordenado de los cultos, transmisiones en vivo, escuelas dominicales y vigilias.
Muestra un cronómetro grande, solemne y elegante que se visualiza con nitidez a larga distancia en el templo, evitando retrasos y manteniendo informada a la congregación.

## 2. Motor de Tiempo sin Desfase (Drift-Free)
- El cálculo del tiempo restante se realiza comparando marcas de tiempo absolutas (`Date.now()` / timestamp meta) en lugar de contadores simples con `setInterval`, lo cual garantiza precisión absoluta de milisegundos sin desfases acumulativos si la CPU entra en alta carga.
- Estado sincronizado en tiempo real por IPC entre la vista del operador y la pantalla congregacional.

## 3. Controles Principales
- **Duración y Preajustes:** Botones rápidos de 5 min, 10 min, 15 min, 30 min y selector de horas/minutos/segundos personalizado.
- **Acciones:**
  - Iniciar cuenta regresiva.
  - Pausar en cualquier momento.
  - Reanudar.
  - Reiniciar al tiempo original.
  - Proyectar u ocultar de la pantalla pública.
- **Mensaje de Finalización:** Al llegar a cero (`00:00:00`), muestra automáticamente un mensaje acogedor (ej. *¡Bienvenidos a la Casa de Dios! El culto ha comenzado*).

## 4. Personalización Visual
- Reloj digital en formato grande `HH:MM:SS` con números tabulares de ancho fijo.
- Tipografía personalizable y soporte de fondos institucionales o de alabanza.

