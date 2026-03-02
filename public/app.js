// ===== CONSULTAS =====

async function consultarTodos() {
  await buscar("/clientes", "tabla-container");
}

async function consultarPorRut() {
  const rut = document.getElementById("buscar-rut").value.trim();
  if (!rut) return mostrarError("tabla-container", "Ingresa un RUT");
  await buscar(`/clientes?rut=${rut}`, "tabla-container");
}

async function consultarPorEdad() {
  const edad = document.getElementById("buscar-edad").value.trim();
  if (!edad) return mostrarError("tabla-container", "Ingresa una edad");
  await buscar(`/clientes?edad=${edad}`, "tabla-container");
}

async function consultarPorRango() {
  const edadMin = document.getElementById("buscar-edadMin").value.trim();
  const edadMax = document.getElementById("buscar-edadMax").value.trim();
  if (!edadMin || !edadMax)
    return mostrarError("tabla-container", "Ingresa ambos valores");
  await buscar(
    `/clientes?edadMin=${edadMin}&edadMax=${edadMax}`,
    "tabla-container",
  );
}

async function consultarPorNombre() {
  const nombre = document.getElementById("buscar-nombre").value.trim();
  if (!nombre)
    return mostrarError("tabla-container", "Ingresa un nombre o prefijo");
  await buscar(`/clientes?nombre=${nombre}`, "tabla-container");
}

// Función reutilizable para todas las consultas GET
async function buscar(url, contenedor) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      return mostrarError(contenedor, data.mensaje || data.error);
    }

    const lista = Array.isArray(data) ? data : [data];
    let tabla = "<table><tr><th>RUT</th><th>Nombre</th><th>Edad</th></tr>";
    lista.forEach((c) => {
      tabla += `<tr>
        <td>${c.rut}</td>
        <td>${c.nombre}</td>
        <td>${c.edad}</td>
      </tr>`;
    });
    tabla += "</table>";
    document.getElementById(contenedor).innerHTML = tabla;
  } catch (error) {
    mostrarError(contenedor, "Error al conectar con el servidor");
  }
}

// ===== CREAR =====

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

// ===== MODIFICAR =====

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

// ===== ELIMINAR =====

async function eliminarPorRut() {
  const rut = document.getElementById("eliminar-rut").value.trim();
  const msg = document.getElementById("eliminar-mensaje");
  if (!rut) {
    msg.className = "mensaje error";
    msg.textContent = "❌ Ingresa un RUT";
    return;
  }

  try {
    const res = await fetch(`/clientes/${rut}`, { method: "DELETE" });
    const data = await res.json();

    if (res.ok) {
      msg.className = "mensaje exito";
      msg.textContent = `✅ Cliente ${data.cliente.nombre} eliminado`;
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

async function eliminarPorEdad() {
  const edad = document.getElementById("eliminar-edad").value.trim();
  const msg = document.getElementById("eliminar-mensaje");
  if (!edad) {
    msg.className = "mensaje error";
    msg.textContent = "❌ Ingresa una edad";
    return;
  }

  try {
    const res = await fetch(`/clientes?edad=${edad}`, { method: "DELETE" });
    const data = await res.json();

    if (res.ok) {
      msg.className = "mensaje exito";
      msg.textContent = `✅ Eliminados: ${data.nombres.join(", ")}`;
      document.getElementById("eliminar-edad").value = "";
    } else {
      msg.className = "mensaje error";
      msg.textContent = `❌ ${data.mensaje || data.error}`;
    }
  } catch (error) {
    msg.className = "mensaje error";
    msg.textContent = "❌ Error al conectar con el servidor";
  }
}

async function eliminarPorRango() {
  const edadMin = document.getElementById("eliminar-edadMin").value.trim();
  const edadMax = document.getElementById("eliminar-edadMax").value.trim();
  const msg = document.getElementById("eliminar-mensaje");
  if (!edadMin || !edadMax) {
    msg.className = "mensaje error";
    msg.textContent = "❌ Ingresa ambos valores";
    return;
  }

  try {
    const res = await fetch(`/clientes?edadMin=${edadMin}&edadMax=${edadMax}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (res.ok) {
      msg.className = "mensaje exito";
      msg.textContent = `✅ Eliminados: ${data.nombres.join(", ")}`;
      document.getElementById("eliminar-edadMin").value = "";
      document.getElementById("eliminar-edadMax").value = "";
    } else {
      msg.className = "mensaje error";
      msg.textContent = `❌ ${data.mensaje || data.error}`;
    }
  } catch (error) {
    msg.className = "mensaje error";
    msg.textContent = "❌ Error al conectar con el servidor";
  }
}

// ===== UTILIDAD =====

function mostrarError(contenedor, mensaje) {
  document.getElementById(contenedor).innerHTML =
    `<p class="mensaje error">❌ ${mensaje}</p>`;
} // ===== CONSULTAS =====

async function consultarTodos() {
  await buscar("/clientes", "tabla-container");
}

async function consultarPorRut() {
  const rut = document.getElementById("buscar-rut").value.trim();
  if (!rut) return mostrarError("tabla-container", "Ingresa un RUT");
  await buscar(`/clientes?rut=${rut}`, "tabla-container");
}

async function consultarPorEdad() {
  const edad = document.getElementById("buscar-edad").value.trim();
  if (!edad) return mostrarError("tabla-container", "Ingresa una edad");
  await buscar(`/clientes?edad=${edad}`, "tabla-container");
}

async function consultarPorRango() {
  const edadMin = document.getElementById("buscar-edadMin").value.trim();
  const edadMax = document.getElementById("buscar-edadMax").value.trim();
  if (!edadMin || !edadMax)
    return mostrarError("tabla-container", "Ingresa ambos valores");
  await buscar(
    `/clientes?edadMin=${edadMin}&edadMax=${edadMax}`,
    "tabla-container",
  );
}

async function consultarPorNombre() {
  const nombre = document.getElementById("buscar-nombre").value.trim();
  if (!nombre)
    return mostrarError("tabla-container", "Ingresa un nombre o prefijo");
  await buscar(`/clientes?nombre=${nombre}`, "tabla-container");
}

// Función reutilizable para todas las consultas GET
async function buscar(url, contenedor) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      return mostrarError(contenedor, data.mensaje || data.error);
    }

    const lista = Array.isArray(data) ? data : [data];
    let tabla = "<table><tr><th>RUT</th><th>Nombre</th><th>Edad</th></tr>";
    lista.forEach((c) => {
      tabla += `<tr>
        <td>${c.rut}</td>
        <td>${c.nombre}</td>
        <td>${c.edad}</td>
      </tr>`;
    });
    tabla += "</table>";
    document.getElementById(contenedor).innerHTML = tabla;
  } catch (error) {
    mostrarError(contenedor, "Error al conectar con el servidor");
  }
}

// ===== CREAR =====

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

// ===== MODIFICAR =====

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

// ===== ELIMINAR =====

async function eliminarPorRut() {
  const rut = document.getElementById("eliminar-rut").value.trim();
  const msg = document.getElementById("eliminar-mensaje");
  if (!rut) {
    msg.className = "mensaje error";
    msg.textContent = "❌ Ingresa un RUT";
    return;
  }

  try {
    const res = await fetch(`/clientes/${rut}`, { method: "DELETE" });
    const data = await res.json();

    if (res.ok) {
      msg.className = "mensaje exito";
      msg.textContent = `✅ Cliente ${data.cliente.nombre} eliminado`;
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

async function eliminarPorEdad() {
  const edad = document.getElementById("eliminar-edad").value.trim();
  const msg = document.getElementById("eliminar-mensaje");
  if (!edad) {
    msg.className = "mensaje error";
    msg.textContent = "❌ Ingresa una edad";
    return;
  }

  try {
    const res = await fetch(`/clientes?edad=${edad}`, { method: "DELETE" });
    const data = await res.json();

    if (res.ok) {
      msg.className = "mensaje exito";
      msg.textContent = `✅ Eliminados: ${data.nombres.join(", ")}`;
      document.getElementById("eliminar-edad").value = "";
    } else {
      msg.className = "mensaje error";
      msg.textContent = `❌ ${data.mensaje || data.error}`;
    }
  } catch (error) {
    msg.className = "mensaje error";
    msg.textContent = "❌ Error al conectar con el servidor";
  }
}

async function eliminarPorRango() {
  const edadMin = document.getElementById("eliminar-edadMin").value.trim();
  const edadMax = document.getElementById("eliminar-edadMax").value.trim();
  const msg = document.getElementById("eliminar-mensaje");
  if (!edadMin || !edadMax) {
    msg.className = "mensaje error";
    msg.textContent = "❌ Ingresa ambos valores";
    return;
  }

  try {
    const res = await fetch(`/clientes?edadMin=${edadMin}&edadMax=${edadMax}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (res.ok) {
      msg.className = "mensaje exito";
      msg.textContent = `✅ Eliminados: ${data.nombres.join(", ")}`;
      document.getElementById("eliminar-edadMin").value = "";
      document.getElementById("eliminar-edadMax").value = "";
    } else {
      msg.className = "mensaje error";
      msg.textContent = `❌ ${data.mensaje || data.error}`;
    }
  } catch (error) {
    msg.className = "mensaje error";
    msg.textContent = "❌ Error al conectar con el servidor";
  }
}

// ===== UTILIDAD =====

function mostrarError(contenedor, mensaje) {
  document.getElementById(contenedor).innerHTML =
    `<p class="mensaje error">❌ ${mensaje}</p>`;
}
