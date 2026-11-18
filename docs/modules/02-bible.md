# Módulo 2: Biblia — Especificación Funcional

## 1. Objetivo y Problema que Resuelve
Facilitar la lectura, búsqueda ultrarrápida y proyección de las Sagradas Escrituras durante el servicio de predicación, lectura bíblica y momentos de adoración en la iglesia.
Permite al operador localizar cualquier referencia en segundos mientras escribe, sin interrumpir jamás la pantalla pública hasta que el versículo es confirmado.

## 2. Traducción Base
- **Versión:** Reina-Valera 1909 (RV1909).
- **Estatus Legal:** **Dominio público internacional**. 100% legal para distribución local preinstalada sin necesidad de licencias propietarias ni conexión a Internet.
- **Alcance:** 66 libros canónicos (39 Antiguo Testamento, 27 Nuevo Testamento).

## 3. Motor Inteligente de Búsqueda por Teclado
El operador puede escribir en cualquier momento en el campo de búsqueda rápida:
- Nombres completos: `Juan 3:16`, `Génesis 1:1`, `Salmos 100:1`
- Con o sin tildes: `Josue 1:9`, `Éxodo 20:3`
- Abreviaturas estándar: `Jn 3:16`, `Gn 1:1`, `1Co 13:4`, `Sal 23:1`, `Ap 22:20`
- Formatos compactos sin espacios: `juan3:16`, `jn3.16`, `1co13:4-8`, `gn1,1`
- Rangos de versículos: `Juan 3:16-18`, `Romanos 8:28-30`
- Tolerancia a errores menores tipográficos mediante normalización fonética y alias.

**Regla de Emisión:** Escribir y explorar referencias es una operación en segundo plano local para el operador. La congregación conserva la proyección actual intacta hasta que el operador pulsa `Enter` o hace clic en "Proyectar".

## 4. Navegación Ágil por Teclado
- `Flecha Derecha` (`ArrowRight`): Avanza al siguiente versículo. Si está proyectando, actualiza la proyección al instante.
- `Flecha Izquierda` (`ArrowLeft`): Retrocede al versículo anterior.
- `Enter`: Proyecta de inmediato la referencia o versículo enfocado.
- `Ctrl + T`: Atajo global para abrir o enfocar la Biblia desde cualquier módulo.
- Selector rápido de Capítulos y Versículos mediante cuadrícula numérica táctil o por teclado.

## 5. Proyección y Personalización Visual
- Modalidades de Proyección:
  - Un versículo único.
  - Varios versículos continuos en una misma diapositiva o paginados dinámicamente si el texto es extenso.
- Opciones de Referencia:
  - Mostrar referencia arriba (`pos-top`) o abajo (`pos-bottom`).
  - Mostrar u ocultar la etiqueta de traducción (`RV1909`).
- Estilos Tipográficos:
  - Familia de fuentes (serif / sans-serif legibles).
  - Tamaño ajustable (desde 2.2rem hasta 5rem responsivo con `clamp`).
  - Negrita, cursiva, mayúsculas sostenidas.
  - Color de texto y color de resaltado de referencia.
  - Fondos predeterminados y fondos fotográficos personalizados.
  - Persistencia local de todas las preferencias en SQLite.

