function agregarAlCarrito(nombre, precio) {
  Swal.fire({
      title: `Ingrese la cantidad de ${nombre} que desea agregar al carrito:`,
      input: 'number',
      inputAttributes: {
          autocapitalize: 'off',
          step: '1',
          min: '1' 
      },
      showCancelButton: true,
      confirmButtonText: 'Agregar al carrito',
      showLoaderOnConfirm: true,
      preConfirm: (cantidad) => {
          cantidad = parseInt(cantidad);
          if (cantidad <= 0 || isNaN(cantidad)) {
              Swal.showValidationMessage(
                  'La cantidad debe ser un número entero positivo.'
              );
          }
          return cantidad;
      },
      allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
      if (result.isConfirmed) {
          const cantidad = result.value;
          const iva = precio * 0.12;
          const total = precio * cantidad + iva;
          const producto = {
              nombre: nombre,
              precio: precio,
              cantidad: cantidad,
              iva: iva,
              total: total
          };
          postJSON(producto)

          let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
          carrito.push(producto);
          sessionStorage.setItem('carrito', JSON.stringify(carrito));

          mostrarCarrito();
      }
  });
}


function eliminarDelCarrito(index) {
  Swal.fire({
      title: "¿Estás seguro que quieres eliminar el producto?",
      icon: "question",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: `
          <i class="fa fa-thumbs-up"></i> Sí
      `,
      confirmButtonAriaLabel: "Sí, eliminar producto",
      cancelButtonText: `
          <i class="fa fa-thumbs-down"></i> No
      `,
      cancelButtonAriaLabel: "No"
  }).then((result) => {
      if (result.isConfirmed) {
          let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
          const productoAEliminar = carrito[index];

          // Eliminar el producto del carrito
          carrito.splice(index, 1);
          sessionStorage.setItem('carrito', JSON.stringify(carrito));

          // Llamar a la función para eliminar el producto del servidor JSON
          eliminarProductoDelServidor(productoAEliminar.id);

          // Mostrar mensaje de confirmación
          Swal.fire(
              "Producto eliminado correctamente",
              "",
              "success"
          );
           eliminarProductoDelServidor() ;
          mostrarCarrito();
      } else {
          Swal.fire(
              "Eliminación cancelada",
              "",
              "error"
          );
      }
  });
}


function mostrarCarrito() {
  const listaCarrito = document.getElementById('lista-carrito');
  listaCarrito.innerHTML = '';

  let totalCarrito = 0; 

  let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
  carrito.forEach((producto, index) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
          <td>${producto.nombre}</td>
          <td>$${producto.precio.toFixed(2)}</td>
          <td><input type="number" min="1" value="${producto.cantidad}" onchange="actualizarCantidad(${index}, this.value)"></td>
          <td>$${producto.iva.toFixed(2)}</td>
          <td>$${producto.total.toFixed(2)}</td>
          <td><button onclick="eliminarDelCarrito(${index})"><i class="fas fa-trash-alt"></i></button></td>

      `;
      listaCarrito.appendChild(fila);

      totalCarrito += producto.total;
  });

 
  document.getElementById('total-carrito').textContent = '$' + totalCarrito.toFixed(2);
}

function actualizarCantidad(index, nuevaCantidad) {
  nuevaCantidad = parseInt(nuevaCantidad);
  if (nuevaCantidad <= 0 || isNaN(nuevaCantidad)) {
      alert("La cantidad debe ser un número entero positivo.");
      mostrarCarrito();
      return;
  }

  let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
  carrito[index].cantidad = nuevaCantidad;
  carrito[index].total = carrito[index].precio * nuevaCantidad + carrito[index].iva;
  sessionStorage.setItem('carrito', JSON.stringify(carrito));

  mostrarCarrito();
}
async function postJSON(data) {
  try {
    const response = await fetch("http://localhost:3000/carrito", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}
function comprar() {
  Swal.fire({
      icon: 'success',
      title: '¡Compra realizada correctamente!',
  });
}
async function eliminarProductoDelServidor(id) {
  try {
    const response = await fetch(`http://localhost:3000/carrito/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      console.log('Producto eliminado del servidor correctamente');
    } else {
      console.error('Error al eliminar el producto del servidor');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getJSON(data) {
  try {
    const response = await fetch("http://localhost:3000/carrito", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deleteJSON(id) {
  try {
    const response = await fetch(`http://localhost:3000/carrito/${id}`, {
      method: "DELETE", 
      
    });

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}