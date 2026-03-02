// Importa el pool de conexiones
const pool = require("./src/db");

// Datos de prueba con edades variadas para probar todos los filtros
const clientes = [
  { rut: "11111111-1", nombre: "Carlos Pérez", edad: 30 },
  { rut: "22222222-2", nombre: "María López", edad: 25 },
  { rut: "33333333-3", nombre: "Jorge Muñoz", edad: 42 },
  { rut: "44444444-4", nombre: "Ana Torres", edad: 25 },
  { rut: "55555555-5", nombre: "Luis Soto", edad: 35 },
  { rut: "66666666-6", nombre: "Carmen Rojas", edad: 28 },
  { rut: "77777777-7", nombre: "Pedro Álvarez", edad: 30 },
  { rut: "88888888-8", nombre: "Rosa González", edad: 22 },
  { rut: "99999999-9", nombre: "Andrés Castillo", edad: 35 },
  { rut: "10101010-1", nombre: "Carolina Vega", edad: 28 },
];

// Función principal que ejecuta todo el proceso
async function seed() {
  console.log("🌱 Iniciando población de la base de datos...\n");

  try {
    // Paso 1: elimina los datos existentes para evitar duplicados
    await pool.query("DELETE FROM clientes");
    console.log("🗑️  Tabla limpiada correctamente");

    // Paso 2: inserta cada cliente uno por uno
    for (const cliente of clientes) {
      await pool.query(
        "INSERT INTO clientes (rut, nombre, edad) VALUES ($1, $2, $3)",
        [cliente.rut, cliente.nombre, cliente.edad],
      );
      console.log(`✅ Insertado: ${cliente.nombre}`);
    }

    console.log("\n🎉 Base de datos poblada correctamente");
    console.log(`📊 Total de registros: ${clientes.length}`);
  } catch (error) {
    console.error("❌ Error al poblar la base de datos:", error.message);
  } finally {
    // Cierra la conexión al terminar, con o sin error
    await pool.end();
    console.log("🔌 Conexión cerrada");
  }
}

// Ejecuta la función
seed();
