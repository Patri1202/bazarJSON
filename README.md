# El Bazar de JSON 🛍️

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![JSON](https://img.shields.io/badge/JSON-000000?style=flat-square&logo=json&logoColor=white)](https://www.json.org/json-es.html)

**El Bazar de JSON** es una aplicación web interactiva que simula un catálogo de comercio electrónico en una sola página (SPA). Permite a los usuarios explorar una lista de productos, aplicar filtros de búsqueda dinámicos combinados y gestionar de forma interactiva un carrito de compras con actualizaciones y animaciones en tiempo real.

Este proyecto ha sido desarrollado como práctica para la asignatura de **Desarrollo Web en Entorno Cliente (DWEC)** dentro del ciclo formativo de Grado Superior en **Desarrollo de Aplicaciones Web (DAW)**.

---

## 🚀 Características Principales

*   **Carga de datos asíncrona**: Consumo de datos local de manera dinámica utilizando la Fetch API (`async/await`) con un archivo `.json` de productos.
*   **Filtros combinados**:
    *   **Precio mínimo**: Filtrado numérico en tiempo real.
    *   **Categoría**: Menú de selección interactivo por categorías de productos.
    *   **Marca**: Filtro por entrada de texto, insensible a mayúsculas y minúsculas.
*   **Gestión del carrito**:
    *   Añadir productos e incrementar cantidades interactivamente.
    *   Eliminación automática de artículos si la cantidad disminuye a 0.
    *   Cálculo automático de subtotales por artículo y del coste total acumulado en euros.
*   **Interfaz Interactiva**:
    *   Diseño responsivo desarrollado con CSS Grid y Flexbox.
    *   Uso de **Animate.css** para micro-animaciones en el carrito y tarjetas de productos.
    *   Integración de **SweetAlert2** para alertas interactivas más estéticas (como confirmación de compra).

---

## 📁 Estructura del Proyecto

El código fuente está organizado de la siguiente manera:

```text
bazar_JSON/
│
├── index.html          # Estructura semántica HTML5 y carga de librerías externas
├── .gitignore          # Archivos y carpetas del editor o sistema excluidos de Git
├── README.md           # Documentación del proyecto
│
├── data/
│   └── productos.json  # Catálogo local de productos en formato JSON
│
└── utils/
    ├── estilos.css     # Estilos de diseño, Grid/Flexbox y responsividad
    └── index.js        # Lógica en JS (Fetch, manipulación del DOM y eventos)
```

---

## 🔧 ¿Cómo probar el proyecto en local?

Puedes abrir y probar este proyecto de forma muy sencilla en tu ordenador utilizando cualquiera de las siguientes opciones:

### Opción 1: Con la extensión Live Server (Recomendado)
Para evitar las restricciones de seguridad del navegador (**CORS**) asociadas a peticiones asíncronas (`fetch`) cuando se abre el archivo `index.html` directamente (con el protocolo `file://`), es recomendable usar un servidor de desarrollo:
1. Abre la carpeta del proyecto en **Visual Studio Code**.
2. Si aún no la tienes, instala la extensión **Live Server**.
3. Haz clic derecho sobre `index.html` y selecciona **"Open with Live Server"** (o usa el botón *Go Live* abajo a la derecha).
4. El proyecto se abrirá en tu navegador por defecto en la dirección local `http://127.0.0.1:5500/index.html`.

### Opción 2: Usando un servidor rápido por Terminal
Si dispones de Python o Node.js instalado, puedes levantar un servidor local en segundos:

*   **Con Python**:
    Abre la terminal en la carpeta del proyecto y ejecuta:
    ```bash
    python -m http.server 8000
    ```
    Luego, abre en tu navegador `http://localhost:8000`.

*   **Con Node.js (npx)**:
    Abre la terminal en la carpeta del proyecto y ejecuta:
    ```bash
    npx http-server -p 8000
    ```
    Luego, abre en tu navegador `http://localhost:8000`.
