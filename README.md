# Préstamos Lab — 0902-23-6637

Sistema web para el control de inventario y gestión de préstamos de equipo en el laboratorio de cómputo universitario.

---

## 📋 Información del Estudiante y Variante

* **Carné:** `0902-23-6637` (Terminación en **7**)
* **Categorías asignadas:** `Monitor`, `Teclado`, `Mouse`
* **Plazo máximo de préstamo:** 5 días
* **Regla adicional:** Mostrar en el `Encabezado` cuántos préstamos están **vencidos**.
* **Título oficial:** `"Préstamos Lab — 0902-23-6637"` (visible en el Encabezado y en la pestaña del navegador).

---

## 🚀 Tecnologías Utilizadas

* **React 19** con **TypeScript**
* **Vite 8** como empaquetador y entorno de desarrollo
* **Tailwind CSS v4** para estilos limpios y responsivos
* **json-server** para la API REST simulada
* **Git y GitHub** para el control de versiones

---

## 🛠️ Pasos para Ejecutar el Proyecto

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/ch4rf/prestamos-equipos-lab.git
cd prestamos-equipos-lab
npm install
```

### 2. Levantar la API REST (json-server)
En una terminal ejecuta:
```bash
npm run server
```
La API iniciará en `http://localhost:3001` con los endpoints:
* `GET /equipos`: Listado del inventario
* `GET /prestamos?devuelto=false`: Préstamos activos
* `POST /prestamos`: Registrar nuevo préstamo
* `PATCH /equipos/:id`: Actualizar disponibilidad
* `PATCH /prestamos/:id`: Marcar préstamo como devuelto

### 3. Levantar la aplicación Frontend
En otra terminal ejecuta:
```bash
npm run dev
```
Abre en tu navegador: [http://localhost:5173](http://localhost:5173).

---

## 📁 Estructura del Proyecto

```text
src/
  components/
    Encabezado/
      Encabezado.tsx       # Título oficial, contadores y regla de vencidos
    Inventario/
      TarjetaEquipo.tsx    # Tarjeta de equipo con props tipadas (sin any)
      ListaEquipos.tsx     # Renderizado por map() con key estable (id)
      FiltrosInventario.tsx # Filtros combinados por nombre y categoría
    Prestamos/
      FormularioPrestamo.tsx # Formulario controlado con validaciones
      TablaPrestamos.tsx     # Préstamos activos con alerta de vencidos
  data/
    equiposIniciales.ts    # Datos mock iniciales (9 equipos de variante 7)
    prestamosIniciales.ts  # Préstamos iniciales para pruebas
  hooks/
    useEquipos.ts          # Custom hook con loading, error y recarga
  services/
    api.ts                 # Funciones tipadas fetch hacia la API REST
  types/
    equipo.ts              # Interface Equipo con tipos estrictos
    prestamo.ts            # Interface Prestamo
  App.tsx                  # Componente principal y gestión de estado
  main.tsx                 # Entrada de la aplicación
db.json                    # Base de datos local para json-server
.env                       # Variables de entorno (VITE_API_URL)
```

---

## 💡 Respuestas a las Preguntas de Reflexión (Para el PDF)

### Parte 1: ¿Por qué no conviene usar el índice del arreglo como `key` cuando la lista puede cambiar?
React utiliza la prop `key` para su algoritmo de reconciliación (Virtual DOM diffing) e identificar qué elementos cambiaron, se agregaron o se eliminaron. Si la lista se filtra o reordena, los índices numéricos cambian de posición y dejan de corresponder al mismo ítem original, provocando que React asocie estados internos e inputs al elemento incorrecto, degradando el rendimiento y causando errores visuales.

### Parte 2: ¿Qué problema aparece si modifica directamente el arreglo del estado en lugar de crear uno nuevo?
React detecta los cambios mediante la comparación superficial de referencias (`Object.is`). Si se muta directamente el arreglo con métodos destructivos como `push` o asignación por índice, la referencia al objeto en memoria sigue siendo idéntica a la anterior, por lo que React asume que nada cambió y no dispara el re-renderizado del componente en la interfaz.

### Parte 3: ¿Qué ocurre si omite el arreglo de dependencias en un `useEffect` que hace un `fetch` y actualiza el estado?
Al omitir el arreglo de dependencias (`[]`), el efecto se ejecuta después de **cada renderizado**. Dado que el `fetch` actualiza el estado al recibir la respuesta, esa actualización desencadena inmediatamente un nuevo renderizado, el cual ejecuta nuevamente el `useEffect` en un **bucle infinito** de peticiones que colapsa el servidor y el navegador.

---

## 📌 Explicación de la Regla Adicional (Variante 7)

**Regla:** *Mostrar en el Encabezado cuántos préstamos están vencidos.*

**Implementación:**
1. Se calcula como un **estado derivado** en tiempo real a partir del arreglo de préstamos activos (`devuelto: false`).
2. Se compara la `fechaLimite` de cada préstamo contra la fecha actual del sistema en formato ISO (`YYYY-MM-DD`):
   ```typescript
   const hoyStr = new Date().toISOString().split('T')[0];
   const prestamosVencidos = prestamosActivos.filter(
     (p) => p.fechaLimite < hoyStr
   ).length;
   ```
3. Este valor numérico se transmite como prop al componente `Encabezado`, el cual renderiza una etiqueta junto al contador de disponibles:
   * Si hay préstamos vencidos (`> 0`), se destaca con un color de alerta suave (`bg-red-50 text-red-700 border-red-200`) para alertar al encargado del laboratorio.
   * Si no hay vencidos, se muestra en color neutro/verde (`bg-green-50 text-green-700`).
