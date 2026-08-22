// El script se ejecuta cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- VARIABLES DE ESTADO ---
    // Array para guardar todos los productos obtenidos de nuestro JSON local
    let productosOriginales = [];
    
    // Array para almacenar los productos añadidos al carrito
    let carrito = [];

    // --- ELEMENTOS DEL DOM ---
    const contenedorProductos = document.getElementById('resultados');
    const listaCarrito = document.getElementById('lista-carrito');
    const totalUI = document.getElementById('precio-total');
    
    const btnFiltrar = document.getElementById('btn-filtrar');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const btnComprar = document.getElementById('btn-comprar');

    // --- FUNCIONES ---

    // Función asíncrona para cargar los productos desde el JSON local
    async function cargarAPI() {
        try {
            // Hacemos la petición a la ruta relativa del archivo JSON
            const res = await fetch('./data/productos.json');
            
            // Si la respuesta no es correcta lanzamos un error
            if (!res.ok) {
                throw new Error(`Error al obtener los datos. Status: ${res.status}`);
            }

            // Convertimos la respuesta a JSON
            const data = await res.json();
            
            // Guardamos los productos en nuestro array de estado
            productosOriginales = data.products;

            // Pintamos los productos en pantalla
            mostrarProductos(productosOriginales);

        } catch (error) {
            // Mostramos el error por consola y damos feedback al usuario
            console.error("Error al cargar el catálogo de productos:", error);
            Swal.fire({
                title: 'Error de carga',
                text: 'No se pudieron cargar los productos. Intenta recargar la página.',
                icon: 'error',
                confirmButtonColor: '#7c3aed'
            });
        }
    }

    // Función para renderizar los productos en el HTML
    function mostrarProductos(lista) {
        // Limpiamos el contenedor
        contenedorProductos.innerHTML = "";

        // Si la lista de productos filtrada está vacía
        if (lista.length === 0) {
            Swal.fire({
                title: 'Sin resultados',
                text: 'No hay productos que coincidan con tu búsqueda',
                icon: 'warning',
                confirmButtonColor: '#7c3aed'
            });
            return;
        }

        // Optimizamos el rendimiento usando DocumentFragment en memoria.
        // Esto evita redibujar la pantalla repetidas veces en el bucle.
        const fragment = document.createDocumentFragment();

        lista.forEach(pro => {
            const div = document.createElement('div');
            div.className = "producto-card animate__animated animate__backInUp";

            // Estructura HTML de la tarjeta.
            // Añadimos 'data-id' en el botón para identificar qué producto se añade.
            div.innerHTML = `
                <img src="${pro.thumbnail}" alt="${pro.title}" loading="lazy">
                <p class="marca-texto">${pro.brand || 'Genérico'}</p>
                <h3>${pro.title}</h3>
                <p class="tag">${pro.category}</p>
                <p class="precio">${pro.price}€</p>
                <button class="btn-agregar" data-id="${pro.id}">AÑADIR AL CARRITO</button>
            `;

            fragment.appendChild(div);
        });

        // Insertamos todas las tarjetas acumuladas de una sola vez
        contenedorProductos.appendChild(fragment);
    }

    // Función para filtrar los productos según el formulario
    function filtrarProductos() {
        const pMin = parseFloat(document.getElementById('precio-min').value) || 0;
        const cat = document.getElementById('select-categoria').value;
        const marca = document.getElementById('input-marca').value.toLowerCase();

        const filtrados = productosOriginales.filter(p => {
            const filtroPrecio = p.price >= pMin;
            const filtroCat = (cat === "all") || (p.category === cat);
            const filtroMarca = (p.brand || "").toLowerCase().includes(marca);

            return filtroPrecio && filtroCat && filtroMarca;
        });

        mostrarProductos(filtrados);
    }

    // Función para limpiar los filtros de búsqueda
    function limpiarFiltros() {
        document.getElementById('precio-min').value = "";
        document.getElementById('select-categoria').value = "all";
        document.getElementById('input-marca').value = "";

        mostrarProductos(productosOriginales);

        Swal.fire({
            title: 'Filtros reseteados',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    }

    // Función para añadir un producto al carrito
    function agregarAlCarrito(id) {
        const producto = productosOriginales.find(p => p.id === id);
        const existe = carrito.find(item => item.id === id);

        if (existe) {
            // Si el producto ya está en el carrito, sumamos uno
            existe.cantidad++;
            existe.esNuevo = false;
            existe.actualizado = true; // Activa animación
        } else {
            // Si es un producto nuevo en el carrito, lo insertamos con cantidad 1
            carrito.push({ ...producto, cantidad: 1, esNuevo: true, actualizado: false });
        }

        actualizarCarritoUI();
    }

    // Función para actualizar la barra lateral del carrito
    function actualizarCarritoUI() {
        listaCarrito.innerHTML = "";
        let sumaTotal = 0;

        if (carrito.length === 0) {
            // Hacemos uso de la clase .carrito-vacio definida en estilos.css
            listaCarrito.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío.</p>`;
            totalUI.innerText = "0.00";
            return;
        }

        const fragment = document.createDocumentFragment();

        carrito.forEach((p, index) => {
            sumaTotal += p.price * p.cantidad;

            const itemDiv = document.createElement('div');

            // Asignación de animaciones según estado
            if (p.esNuevo) {
                itemDiv.className = "item-carrito animate__animated animate__fadeInRight";
                p.esNuevo = false;
            } else if (p.actualizado) {
                itemDiv.className = "item-carrito animate__animated animate__rubberBand";
                p.actualizado = false;
            } else {
                itemDiv.className = "item-carrito";
            }

            // Estructura del item en el carrito.
            // Guardamos el índice y la acción en atributos 'data-' para delegación de eventos.
            itemDiv.innerHTML = `
                <span class="nombre-item">${p.title}</span>
                <div class="controles-cantidad">
                    <button class="btn-cantidad" data-index="${index}" data-cambio="-1">-</button>
                    <strong class="cantidad-num">${p.cantidad}</strong>
                    <button class="btn-cantidad" data-index="${index}" data-cambio="1">+</button>
                </div>
                <span class="subtotal">${(p.price * p.cantidad).toFixed(2)}€</span>
            `;

            fragment.appendChild(itemDiv);
        });

        listaCarrito.appendChild(fragment);
        totalUI.innerText = sumaTotal.toFixed(2);
    }

    // Función para incrementar o decrementar la cantidad de un artículo en el carrito
    function cambiarCantidad(indice, cambio) {
        carrito[indice].cantidad += cambio;
        carrito[indice].esNuevo = false;

        if (cambio > 0) {
            carrito[indice].actualizado = true;
        }

        // Si la cantidad llega a 0 o menos, eliminamos el elemento del array
        if (carrito[indice].cantidad <= 0) {
            carrito.splice(indice, 1);
        }

        actualizarCarritoUI();
    }

    // Función para procesar y confirmar la compra del carrito
    function realizarCompra() {
        if (carrito.length === 0) {
            Swal.fire('Carrito vacío', 'Añade algún producto antes de comprar', 'info');
            return;
        }

        const total = totalUI.innerText;

        Swal.fire({
            title: '¿Confirmar compra?',
            text: `Vas a realizar una compra por valor de ${total}€.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#7c3aed',
            cancelButtonColor: '#f87171'
        }).then((result) => {
            if (result.isConfirmed) {
                carrito = [];
                actualizarCarritoUI();
                Swal.fire('¡Éxito!', 'Gracias por tu compra', 'success');
            }
        });
    }

    // --- EVENT LISTENERS (DELEGACIÓN DE EVENTOS) ---

    // Delegación de eventos para agregar productos al carrito
    contenedorProductos.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-agregar')) {
            const id = parseInt(event.target.getAttribute('data-id'), 10);
            agregarAlCarrito(id);
        }
    });

    // Delegación de eventos para los botones '+' y '-' del carrito
    listaCarrito.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-cantidad')) {
            const index = parseInt(event.target.getAttribute('data-index'), 10);
            const cambio = parseInt(event.target.getAttribute('data-cambio'), 10);
            cambiarCantidad(index, cambio);
        }
    });

    // Eventos para el formulario de filtrado y control
    btnFiltrar.addEventListener('click', filtrarProductos);
    btnLimpiar.addEventListener('click', limpiarFiltros);
    btnComprar.addEventListener('click', realizarCompra);

    // --- INICIALIZACIÓN DE LA APLICACIÓN ---
    cargarAPI();
    actualizarCarritoUI();

});