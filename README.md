# CRUD Clientes con Filtros — Node.js + PostgreSQL

Ampliación del proyecto CRUD anterior. Incorpora filtros avanzados mediante **query parameters** para consultar y eliminar clientes por distintos criterios. Incluye frontend actualizado con Bootstrap 5 y Bootstrap Icons.

---

## Tecnologías utilizadas

- **Node.js** — entorno de ejecución del servidor
- **Express** — framework para construir el servidor web y las rutas REST
- **PostgreSQL** — base de datos relacional
- **pg** — librería cliente para conectar Node.js con PostgreSQL
- **dotenv** — manejo de variables de entorno
- **nodemon** — reinicio automático del servidor en desarrollo
- **Bootstrap 5** — framework CSS para estilos y grilla
- **Bootstrap Icons** — iconos via CDN
- **Thunder Client** — pruebas de endpoints REST
- **HTML / CSS / JavaScript** — interfaz de usuario

---

## Estructura del proyecto

```
crud-clientes-filtros/
├── public/                → Frontend
│   ├── index.html         → Página principal con formularios y filtros
│   ├── style.css          → Estilos personalizados (complementa Bootstrap)
│   └── app.js             → Lógica frontend (fetch API)
├── src/                   → Backend
│   ├── db.js              → Configuración del pool de conexiones PostgreSQL
│   └── routes/
│       └── clientes.js    → Endpoints CRUD con filtros
├── .env                   → Variables de entorno (no incluido en Git)
├── .gitignore             → Archivos ignorados por Git
├── package.json           → Dependencias y scripts del proyecto
├── seed.js                → Script para poblar la base de datos
└── server.js              → Punto de entrada del servidor
```

---

## Requisitos previos

- Node.js instalado
- PostgreSQL instalado y en ejecución
- Base de datos `taller_clientes` creada en PostgreSQL

---

## Instalación y configuración

**1. Clonar el repositorio**

```bash
git clone
cd crud-clientes-filtros
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Crear el archivo `.env`** en la raíz del proyecto:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taller_clientes
DB_USER=postgres
DB_PASSWORD=tu_contraseña
```

**4. Crear la tabla en PostgreSQL**

```sql
CREATE TABLE IF NOT EXISTS clientes (
  rut    VARCHAR(20)  PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  edad   INT          NOT NULL
);
```

**5. Poblar la base de datos**

```bash
npm run seed
```

**6. Iniciar el servidor**

```bash
npm run dev
```

**7. Abrir en el navegador**

```
http://localhost:3000
```

---

## Endpoints disponibles

| Método | Ruta                          | Descripción                         | Códigos posibles   |
| ------ | ----------------------------- | ----------------------------------- | ------------------ |
| GET    | `/clientes`                   | Retorna todos los clientes          | 200, 500           |
| GET    | `/clientes?rut=`              | Busca un cliente por rut            | 200, 404, 500      |
| GET    | `/clientes?edad=`             | Busca clientes por edad exacta      | 200, 404, 500      |
| GET    | `/clientes?edadMin=&edadMax=` | Busca clientes por rango de edad    | 200, 404, 500      |
| GET    | `/clientes?nombre=`           | Busca clientes por nombre o prefijo | 200, 404, 500      |
| POST   | `/clientes`                   | Crea un nuevo cliente               | 201, 400, 409, 500 |
| PUT    | `/clientes/:rut`              | Modifica el nombre de un cliente    | 200, 400, 404, 500 |
| DELETE | `/clientes/:rut`              | Elimina un cliente por rut          | 200, 404, 500      |
| DELETE | `/clientes?edad=`             | Elimina clientes por edad exacta    | 200, 404, 500      |
| DELETE | `/clientes?edadMin=&edadMax=` | Elimina clientes por rango de edad  | 200, 404, 500      |

---

## Concepto clave: Query Parameters

Los query parameters son filtros opcionales que viajan en la URL después del signo `?`:

```
GET /clientes?edad=25
GET /clientes?edadMin=20&edadMax=30
GET /clientes?nombre=Car
```

En Express se acceden mediante `req.query`:

```javascript
const { edad, edadMin, edadMax, nombre } = req.query;
```

---

## Script seed.js

Pobla la base de datos con 10 registros de prueba. Limpia la tabla antes de insertar para evitar duplicados.

```bash
npm run seed
```

---

## Autor

**Jorge Bosch** — Aprendiz Fullstack Javascript
