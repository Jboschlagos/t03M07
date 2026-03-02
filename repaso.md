# Creación de un Proyecto Node.js desde la Terminal
### Guía de referencia personal — Taller Full Stack JavaScript

---

## Introducción

Una de las competencias fundamentales del desarrollador profesional es la capacidad de construir la estructura de un proyecto directamente desde la **terminal**, sin depender de interfaces gráficas para crear carpetas o archivos. Este documento registra el proceso completo, explicando cada comando y su propósito, de modo que pueda replicarse en futuros proyectos.

La terminal utilizada en este contexto es **Git Bash**, disponible en entornos Windows, integrada dentro de VS Code mediante el atajo `Ctrl + \``.

---

## Conceptos previos importantes

### ¿Qué es la terminal?

La terminal (también llamada consola o línea de comandos) es una interfaz de texto que permite comunicarse directamente con el sistema operativo. En desarrollo de software, es la herramienta principal para crear proyectos, instalar dependencias, ejecutar servidores y gestionar repositorios.

### ¿Qué es npm?

`npm` (*Node Package Manager*) es el gestor de paquetes oficial de Node.js. Su función es descargar, instalar y administrar las librerías externas que un proyecto necesita para funcionar. Toda esta información queda registrada en un archivo llamado `package.json`.

### ¿Qué es Git?

Git es un sistema de **control de versiones** que permite registrar el historial de cambios de un proyecto. Es importante inicializarlo **dentro de la carpeta del proyecto** y nunca en una carpeta raíz del sistema operativo, para evitar que rastree archivos personales del computador.

---

## Parte 1 — Comandos esenciales de navegación

Antes de crear cualquier proyecto, es necesario dominar los comandos básicos de orientación dentro del sistema de archivos.

```bash
# Muestra la ruta de la carpeta actual (print working directory)
pwd

# Lista los archivos y carpetas del directorio actual
ls

# Navega hacia una carpeta específica (change directory)
cd nombre-de-la-carpeta

# Retrocede un nivel hacia la carpeta anterior
cd ..

# Muestra el contenido de un archivo directamente en la terminal
cat nombre-del-archivo
```

---

## Parte 2 — Construcción del proyecto paso a paso

### Paso 1 — Ubicarse en la carpeta de trabajo

```bash
# Navegar a la carpeta donde se almacenan los proyectos
cd Documents
```

### Paso 2 — Crear la carpeta principal del proyecto

```bash
# Crea una carpeta nueva con el nombre indicado (make directory)
mkdir crud-clientes

# Ingresar a la carpeta recién creada
cd crud-clientes
```

> **Nota:** Desde este momento, **todo comando debe ejecutarse estando posicionado dentro de esta carpeta**. Verificar con `pwd` siempre que haya dudas sobre la ubicación actual.

### Paso 3 — Inicializar el proyecto Node.js

```bash
# Crea el archivo package.json con valores predeterminados
# La bandera -y responde "sí" automáticamente a todas las preguntas
npm init -y
```

Resultado esperado: aparece el archivo `package.json` en la carpeta. Este archivo es la **hoja de vida** del proyecto y registra su nombre, versión y dependencias.

### Paso 4 — Instalar las dependencias principales

```bash
# Instala las librerías necesarias para el proyecto
# express  → framework para construir el servidor web
# pg       → cliente que conecta Node.js con PostgreSQL
npm install express pg
```

Este comando crea automáticamente la carpeta `node_modules/` y el archivo `package-lock.json`.

### Paso 5 — Instalar nodemon como dependencia de desarrollo

```bash
# nodemon reinicia el servidor automáticamente al detectar cambios en el código
# --save-dev indica que es una herramienta solo para desarrollo, no para producción
npm install --save-dev nodemon
```

### Paso 6 — Crear el archivo .gitignore ANTES de inicializar Git

Este paso es crítico. El archivo `.gitignore` le indica a Git qué carpetas y archivos debe **ignorar completamente**. Debe crearse antes de inicializar el repositorio para evitar que Git rastree archivos innecesarios.

```bash
# Crea un archivo vacío llamado .gitignore
touch .gitignore
```

Abrir el archivo en VS Code y agregar el siguiente contenido:

```
node_modules/
.env
```

> **¿Por qué ignorar estas carpetas?**
> - `node_modules/` puede contener miles de archivos generados automáticamente. No tiene sentido subirlos a un repositorio porque cualquier desarrollador puede regenerarlos con `npm install`.
> - `.env` contiene credenciales sensibles como contraseñas de bases de datos. Nunca debe subirse a repositorios públicos.

### Paso 7 — Inicializar el repositorio Git

```bash
# Inicializa un repositorio Git en la carpeta actual
git init
```

> **Advertencia importante:** Nunca ejecutar `git init` en carpetas raíz del sistema como `C:/Users/TuUsuario`. Esto causaría que Git intente rastrear todos los archivos personales del computador. Siempre inicializar Git **dentro de la carpeta específica del proyecto**.

### Paso 8 — Crear la estructura de carpetas y archivos

```bash
# Crear carpetas
mkdir public
mkdir src
mkdir src/routes

# Crear archivos del backend
touch server.js
touch src/db.js
touch src/routes/clientes.js
touch .env

# Crear archivos del frontend
touch public/index.html
touch public/style.css
touch public/app.js
```

> `touch` crea un archivo vacío con el nombre indicado. Si el archivo ya existe, actualiza su fecha de modificación sin alterar su contenido.

### Paso 9 — Configurar los scripts de arranque

Abrir `package.json` y modificar la sección `scripts` para que quede así:

```json
"scripts": {
  "start": "node server.js",
  "dev":   "nodemon server.js"
}
```

Desde este momento el servidor puede iniciarse con:

```bash
# Modo desarrollo (reinicio automático al guardar cambios)
npm run dev

# Modo producción
npm start
```

### Paso 10 — Verificar la estructura final

```bash
# Lista todos los archivos del proyecto excluyendo node_modules y .git
find . -not -path './node_modules/*' -not -path './.git/*'
```

---

## Parte 3 — Estructura final esperada

Al completar todos los pasos, el proyecto debe tener la siguiente organización:

```
crud-clientes/
├── public/              → Frontend (lo que ve el usuario en el navegador)
│   ├── index.html       → Página principal con los formularios
│   ├── style.css        → Estilos visuales
│   └── app.js           → Lógica del frontend (peticiones fetch)
├── src/                 → Backend organizado por responsabilidad
│   ├── db.js            → Configuración de la conexión a PostgreSQL
│   └── routes/
│       └── clientes.js  → Los 4 endpoints CRUD
├── .env                 → Credenciales de la base de datos (nunca a Git)
├── .gitignore           → Lista de archivos ignorados por Git
├── package.json         → Hoja de vida del proyecto
├── package-lock.json    → Registro exacto de versiones instaladas
└── server.js            → Punto de entrada principal del servidor
```

---

## Parte 4 — Tabla resumen de comandos

| Comando | Significado | Para qué sirve |
|---|---|---|
| `pwd` | *print working directory* | Muestra dónde estás ubicado |
| `ls` | *list* | Lista archivos y carpetas |
| `cd carpeta` | *change directory* | Navega hacia una carpeta |
| `cd ..` | — | Retrocede un nivel |
| `mkdir nombre` | *make directory* | Crea una carpeta |
| `touch archivo` | — | Crea un archivo vacío |
| `cat archivo` | *concatenate* | Muestra el contenido de un archivo |
| `rm -rf carpeta` | *remove* | Elimina una carpeta y todo su contenido |
| `npm init -y` | — | Inicializa un proyecto Node.js |
| `npm install lib` | — | Instala una librería |
| `git init` | — | Inicializa un repositorio Git |
| `git status` | — | Muestra el estado actual del repositorio |

---

## Parte 5 — Error frecuente: Git en la carpeta equivocada

### ¿Cómo se produce?

Si en algún momento se ejecuta `git init` dentro de `C:/Users/TuUsuario`, Git comienza a rastrear **todos los archivos del computador**. VS Code lo detecta y muestra miles de cambios pendientes en el panel de Control de Código Fuente.

### ¿Cómo solucionarlo?

```bash
# Verificar dónde está el repositorio mal ubicado
git rev-parse --show-toplevel

# Navegar a esa carpeta
cd C:/Users/TuUsuario

# Eliminar la carpeta .git (esto NO borra archivos personales)
rm -rf .git
```

Alternativamente, desde el **Explorador de Windows**: activar la visibilidad de archivos ocultos en *Ver → Mostrar → Elementos ocultos*, navegar a `C:\Users\TuUsuario` y eliminar la carpeta `.git` manualmente.

---

*Documento generado durante el proceso formativo — Módulo 7 Full Stack JavaScript*