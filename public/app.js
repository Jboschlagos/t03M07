// ===== CONSULTAR TODOS =====
async function consultarClientes() {
  try {
    const res = await fetch("/clientes");
    const data = await res.json();

    if (data.length === 0) {
      document.getElementById("tabla-container").innerHTML =
        "<p>No hay clientes registrados.</p>";
      return;
    }

    // Construye la tabla HTML con los datos recibidos
    let tabla = "<table><tr><th>RUT</th><th>Nombre</th><th>Edad</th></tr>";
    data.forEach((cliente) => {
      tabla += `<tr>
        <td>${cliente.rut}</td>
        <td>${cliente.nombre}</td>
        <td>${cliente.edad}</td>
        </tr>`;
    });
    tabla += "</table>";

    document.getElementById("tabla-container").innerHTML = tabla;
  } catch (error) {
    document.getElementById("tabla-container").innerHTML =
      "<p>Error al consultar.</p>";
  }
}

// ===== CREAR CLIENTE =====
async function crearCliente() {
  const rut = document.getElementById("crear-rut").value.trim();
  const nombre = document.getElementById("crear-nombre").value.trim();
  const edad = document.getElementById("crear-edad").value.trim();
  const msg = document.getElementById("crear-mensaje");

  try {
    const res = await fetch("/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rut, nombre, edad }),
    });
    const data = await res.json();

    if (res.ok) {
      msg.className = "mensaje exito";
      msg.textContent = `✅ Cliente ${data.nombre} creado correctamente`;
      // Limpia los campos
      document.getElementById("crear-rut").value = "";
      document.getElementById("crear-nombre").value = "";
      document.getElementById("crear-edad").value = "";
    } else {
      msg.className = "mensaje error";
      msg.textContent = `❌ ${data.error}`;
    }
  } catch (error) {
    msg.className = "mensaje error";
    msg.textContent = "❌ Error al conectar con el servidor";
  }
}

// ===== MODIFICAR CLIENTE =====
async function modificarCliente() {
  const rut = document.getElementById("modificar-rut").value.trim();
  const nombre = document.getElementById("modificar-nombre").value.trim();
  const msg = document.getElementById("modificar-mensaje");

  try {
    const res = await fetch(`/clientes/${rut}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });
    const data = await res.json();

    if (res.ok) {
      msg.className = "mensaje exito";
      msg.textContent = `✅ Nombre actualizado a ${data.cliente.nombre}`;
      document.getElementById("modificar-rut").value = "";
      document.getElementById("modificar-nombre").value = "";
    } else {
      msg.className = "mensaje error";
      msg.textContent = `❌ ${data.error}`;
    }
  } catch (error) {
    msg.className = "mensaje error";
    msg.textContent = "❌ Error al conectar con el servidor";
  }
}

// ===== ELIMINAR CLIENTE =====
async function eliminarCliente() {
  const rut = document.getElementById("eliminar-rut").value.trim();
  const msg = document.getElementById("eliminar-mensaje");

  try {
    const res = await fetch(`/clientes/${rut}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (res.ok) {
      msg.className = "mensaje exito";
      msg.textContent = `✅ Cliente ${data.cliente.nombre} eliminado correctamente`;
      document.getElementById("eliminar-rut").value = "";
    } else {
      msg.className = "mensaje error";
      msg.textContent = `❌ ${data.error}`;
    }
  } catch (error) {
    msg.className = "mensaje error";
    msg.textContent = "❌ Error al conectar con el servidor";
  }
}
