//Variables
let carrito = [];
let total = 0;
let productos = [];

//Productos obtenidos del .json 
fetch('../json/productos.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }
        return response.json();
    })
    .then(data => {
        productos = data;
        console.log(data)
        iniciarSimulador();
    })
    .catch(error => {
        console.error('Hubo un problema al cargar los productos:', error);
    });


function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('total', total);
}

// Función para cargar el carrito de localStorage
function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    const totalGuardado = localStorage.getItem('total');

    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }

    if (totalGuardado) {
        total = parseFloat(totalGuardado);
    }
}

// Función para mostrar productos disponibles
function mostrarProductos() {
    const contenedorProductos = document.getElementById('productos');
    contenedorProductos.innerHTML = '';

    // Agrupar productos por categoría
    const productosPorCategoria = {};

    productos.forEach(prod => {
        if (!productosPorCategoria[prod.categoria]) {
            productosPorCategoria[prod.categoria] = [];
        }
        productosPorCategoria[prod.categoria].push(prod);
    });

    // Mostrar productos agrupados
    for (const categoria in productosPorCategoria) {
        // Crear contenedor para categoría
        const contenedorCategoria = document.createElement('div');
        contenedorCategoria.classList.add('contenedor-categoria');

        // Crear encabezado de categoría
        const tituloCategoria = document.createElement('h2');
        tituloCategoria.textContent = categoria;
        contenedorCategoria.appendChild(tituloCategoria);

        // Crear contenedor para productos de esta categoría
        const contenedorProductosCategoria = document.createElement('div');
        contenedorProductosCategoria.classList.add('productos-categoria');
        contenedorCategoria.appendChild(contenedorProductosCategoria);

        // Mostrar productos de esta categoría

        productosPorCategoria[categoria].forEach(prod => {
            const div = document.createElement('div');
            div.classList.add('producto');
            div.innerHTML = `
                <img src="./assets/productos/${prod.categoria}/${prod.imagen}" alt="${prod.nombre}" class='imagen-producto'">
                <h3>${prod.nombre}</h3>
                <p class='precio-producto'>Precio: $${prod.precio}</p>
                <button onclick="agregarProducto(${prod.id})" class='btn-agregar-producto'>Agregar al carrito</button>
            `;
            contenedorProductosCategoria.appendChild(div);
        });

        contenedorProductos.appendChild(contenedorCategoria);
    }
}


// Función para agregar productos al carrito
const panelCarrito = document.getElementById('panelCarrito');
const iconoCarrito = document.getElementById('iconoCarrito');
const cerrarCarrito = document.getElementById('cerrarCarrito');

iconoCarrito.addEventListener('click', (e) => {
    e.preventDefault();
    panelCarrito.classList.toggle('abierto');
});

cerrarCarrito.addEventListener('click', () => {
    panelCarrito.classList.remove('abierto');
});

// Mostrar automáticamente al agregar un producto
function agregarProducto(id) {
    const productoSeleccionado = productos.find(producto => producto.id === id);

    if (productoSeleccionado) {
        carrito.push(productoSeleccionado);
        total += productoSeleccionado.precio;
        guardarCarritoEnLocalStorage();
        mostrarCarrito();
        panelCarrito.classList.add('abierto'); // abrir carrito automáticamente
    }
}


// Función para mostrar el resumen de la compra
function mostrarCarrito() {
    const contenedorCarrito = document.getElementById('carrito');
    contenedorCarrito.innerHTML = '';

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>No hay productos en el carrito.</p>";
        return;
    }

    const lista = document.createElement('ul');
    lista.classList.add('lista-carrito');

    carrito.forEach((item, index) => {
        const li = document.createElement('li');
        li.classList.add('item-carrito');

        li.innerHTML = `
            <img src="./assets/productos/${item.categoria}/${item.imagen}" alt="${item.nombre}" class="miniatura">
            <div class="info-producto">
                <p class="nombre">${item.nombre}</p>
                <p class="precio">$${item.precio}</p>
            </div>
            <button class="btn-eliminar" onclick="eliminarProductoDelCarrito(${index})"><img src='./assets/eliminar.webp' alt='eliminar' class='icono-eliminar'/></button>
        `;

        lista.appendChild(li);
    });

    const totalElemento = document.createElement('p');
    totalElemento.classList.add('total-carrito');
    totalElemento.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;

    contenedorCarrito.appendChild(lista);
    contenedorCarrito.appendChild(totalElemento);
}

function eliminarProductoDelCarrito(index) {
    const productoEliminado = carrito.splice(index, 1)[0];
    total -= productoEliminado.precio;
    guardarCarritoEnLocalStorage();
    mostrarCarrito();
}


// Función principal
function iniciarSimulador() {

    agregarProducto();
    mostrarCarrito();
}

// Confirmar compra
document.getElementById('confirmarCompra').onclick = function () {
    if (carrito.length > 0) {
        swal({
            title: "¿Desea confirmar la compra?",
            icon: "warning",
            buttons: true,
            dangerMode: false,
        })
            .then((willDelete) => {
                if (willDelete) {
                     swal("Compra realizada con éxito.", "¡Gracias por su compra!", "success");
                } else {
                     swal("Compra cancelada.", "", "error");
                }
            });

    } else {
        swal("No hay productos en el carrito para confirmar.", "", "info");
    }
    carrito = [];
    total = 0;
    guardarCarritoEnLocalStorage();
    mostrarCarrito();
    
}

function iniciarSimulador() {
    cargarCarritoDesdeLocalStorage();
    mostrarProductos();
    mostrarCarrito();
}
