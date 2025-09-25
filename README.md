# Proyecto: Portafolio Personal - Ingeniería del Software 3

Este repositorio contiene el código fuente de la versión **"con framework"** del proyecto final para la asignatura Ingeniería del Software 3 de la Universidad del Cauca. El objetivo es presentar un portafolio web personal, dinámico e interactivo, que demuestre la aplicación de patrones de diseño, metodologías de desarrollo y tecnologías web modernas.

**Autores:**
*   **Sofía Arango Yanza** - `anaarangowt@unicauca.edu.co`
*   **Juan Diego Gómez Garcés** - `juangomezmu@unicauca.edu.co`

---

## 🚀 Vista Previa de la Aplicación

A continuación, se presentan las secciones principales de nuestro portafolio.

### 1. Sección de Inicio
La página recibe al usuario con un carrusel interactivo a pantalla completa que presenta a los autores del proyecto, incluyendo una foto, fecha de nacimiento y una breve declaración de sus aspiraciones profesionales.
<img width="1599" height="736" alt="image" src="https://github.com/user-attachments/assets/82fe07a5-1303-47da-9d7f-0e86f5cc61c9" />

<img width="1599" height="736" alt="image" src="https://github.com/user-attachments/assets/2763a71f-701d-4223-a5a3-ddc3cea4c587" />

### 2. Sección de Estudios
Muestra la trayectoria académica de ambos autores de forma clara y organizada en tarjetas separadas, utilizando tablas estilizadas para una fácil lectura.
<img width="1599" height="735" alt="image" src="https://github.com/user-attachments/assets/52c05ecc-20a0-4b98-8c6e-7c4723cab9bb" />

### 3. Sección de Pasatiempos
Presenta tres pasatiempos compartidos a través de tarjetas con un efecto visual moderno. Al pasar el cursor, se revela una descripción y la imagen de fondo tiene un sutil efecto de zoom.

<img width="1599" height="731" alt="image" src="https://github.com/user-attachments/assets/86e82d0d-640b-4fc9-a6bf-6e5c06879281" />

### 4. Sección de Proyectos
Exhibe tres proyectos destacados en los que hemos trabajado. Cada proyecto se muestra en una tarjeta que incluye un ícono representativo, una descripción, las tecnologías utilizadas y un enlace externo al repositorio o documento correspondiente.

<img width="1599" height="734" alt="image" src="https://github.com/user-attachments/assets/1c58d42c-cd8f-4fc0-a836-e492d55b67f8" />

### 5. Sección de Contacto (Aplicación CRUD)
Esta sección no es solo un formulario, sino una aplicación completa de gestión de contactos (CRUD) que funciona en el lado del cliente. Permite a los usuarios guardar, editar y eliminar contactos, con persistencia de datos en el navegador.

<img width="1599" height="731" alt="image" src="https://github.com/user-attachments/assets/fa18b45f-fb2f-4d59-bb6f-bd214e61c411" />

---

## ✨ Características Principales

Este proyecto cumple con todos los requisitos solicitados, implementando las siguientes características:

*   ✅ **Diseño Responsivo:** La interfaz se adapta fluidamente a diferentes tamaños de pantalla, desde dispositivos móviles hasta escritorios, utilizando el sistema de Grid de Bootstrap.
*   ✅ **Navegación Fija e Interactiva:** La barra de navegación superior es fija y cambia de apariencia al hacer scroll. Además, resalta automáticamente la sección que se está visualizando.
*   ✅ **Carrusel de Imágenes:** La sección de inicio utiliza un carrusel de Bootstrap para presentar a los autores de manera dinámica.
*   ✅ **Animaciones de Scroll:** Se utiliza la librería AOS (Animate On Scroll) para agregar animaciones sutiles a los elementos a medida que aparecen en pantalla, mejorando la experiencia de usuario.
*   ✅ **Formulario de Contacto Funcional (CRUD):**
    *   **Validación en Tiempo Real y al Enviar:** Implementa validación robusta con JavaScript para todos los campos requeridos, proporcionando mensajes de error claros e intuitivos.
    *   **Persistencia de Datos:** Utiliza `localStorage` para guardar, actualizar y eliminar contactos, manteniendo la información incluso después de recargar la página.
    *   **Componentes de UI Personalizados:** Incluye un **modal de confirmación** para acciones destructivas (eliminar uno o todos los contactos) y **notificaciones toast** para dar feedback al usuario sobre el resultado de sus acciones.
*   ✅ **Organización bajo Atomic Design:** La estructura de los archivos CSS sigue la metodología de Atomic Design, separando los componentes en **átomos, moléculas y organismos** para máxima modularidad y mantenibilidad.
*   ✅ **CSS Personalizado:** Aunque se usa Bootstrap como base, se han añadido numerosos estilos personalizados para lograr una identidad visual única y coherente.

---

## 🛠️ Tecnologías Utilizadas

*   **Frontend:**
    *   HTML5 (Semántico)
    *   CSS3
    *   JavaScript (ES6+)
*   **Frameworks y Librerías:**
    *   **Bootstrap 5:** Para el layout responsivo, componentes base y sistema de grid.
    *   **Font Awesome:** Para la iconografía utilizada en todo el sitio.
    *   **Google Fonts:** Para las tipografías *Poppins* (principal) y *Great Vibes* (artística).
    *   **AOS (Animate On Scroll):** Para las animaciones de entrada de los elementos.

---

## 🏛️ Arquitectura y Patrones

La aplicación fue construida siguiendo patrones de diseño y arquitecturas claras para garantizar un código limpio, organizado y escalable.

### Atomic Design (CSS)

La estructura de estilos se organiza siguiendo los principios de Atomic Design:
*   **`components/atoms`**: Los bloques más pequeños e indivisibles de la UI (botones, inputs, etiquetas, títulos).
*   **`components/molecules`**: Grupos de átomos que funcionan como una unidad (formularios de búsqueda, tarjetas de proyecto, etc.).
*   **`components/organisms`**: Componentes más complejos que forman secciones discretas de la interfaz (encabezado, pie de página, sección de contacto completa).

### Patrones de Software (JavaScript)

La lógica para la gestión de contactos en la sección "Contacto" implementa los patrones **Repository** y **Facade** para separar responsabilidades:

1.  **Modelo (`Contacto`):** Una clase que representa la estructura de un contacto, definiendo sus propiedades (id, nombre, email, etc.).
2.  **Repositorio (`ContactRepository`):** Su única responsabilidad es manejar la persistencia de los datos. Abstrae la lógica de cómo se guardan y leen los contactos desde `localStorage`, exponiendo métodos como `getAll()`, `getById(id)`, `add(contact)`, `update(contact)` y `remove(id)`.
3.  **Fachada (`ContactFacade`):** Actúa como un punto de entrada simple y unificado para la interfaz de usuario. Oculta la complejidad interna del repositorio y el modelo, ofreciendo métodos de alto nivel como `guardarContacto()`, `listarContactos()` y `eliminarContacto(id)`. La UI solo interactúa con la Fachada.

---

## 📂 Estructura del Proyecto

El proyecto está organizado siguiendo las mejores prácticas y la metodología de Atomic Design para una fácil navegación y mantenimiento.

```plaintext
Portafolio-Web-con-Bootstrap/
├── README.md                 # Documentación del proyecto.
├── index.html                # Punto de entrada principal de la aplicación.
├── assets/
│   └── images/               # Contiene todas las imágenes estáticas (fotos, fondos, etc.).
├── css/
│   └── custom.css            # Estilos globales, variables CSS (:root) y overrides.
├── components/                 # Directorio raíz para la metodología Atomic Design.
│   ├── atoms/                # Componentes básicos e indivisibles.
│   │   ├── button.css
│   │   ├── form-input.css
│   │   ├── section-title.css
│   │   ├── social-icon.css
│   │   └── tag.css
│   ├── molecules/            # Combinaciones de átomos que forman unidades funcionales.
│   │   ├── contact-form.css
│   │   ├── contact-list.css
│   │   ├── footer-contact-info.css
│   │   ├── hobby-card.css
│   │   ├── image-overlay.css
│   │   ├── modal.css
│   │   ├── project-card.css
│   │   ├── study-card.css
│   │   ├── styled-table.css
│   │   └── toast.css
│   └── organisms/            # Secciones completas de la página.
│       ├── contacto-section.css
│       ├── estudios-section.css
│       ├── footer.css
│       ├── header.css
│       ├── inicio-section.css
│       ├── pasatiempos-section.css
│       └── proyectos-section.css
└── js/
    ├── app.js                # Lógica principal de la UI, inicialización y manejo de eventos.
    └── contact/              # Módulos para la lógica de la aplicación de contacto.
        ├── domain/
        │   └── Contacto.js     # El Modelo (clase Contacto) que define la estructura de datos.
        ├── facade/
        │   └── ContactFacade.js # La Fachada que simplifica la interacción con la lógica de negocio.
        └── repository/
            └── ContactRepository.js # El Repositorio que maneja la persistencia en localStorage.
```

---

## 📝 Ítems de Investigación

Se abordaron los puntos de investigación solicitados en los requerimientos del proyecto:

### 1. Persistencia con `localStorage` usando Patrones Repository y Facade

Se implementó con éxito la persistencia en el cliente utilizando `localStorage`. El patrón **Repository** se encarga de la comunicación directa con la API de `localStorage` (leer, escribir, actualizar JSON), mientras que el patrón **Facade** simplifica el acceso a estos datos desde la lógica de la interfaz (el archivo `app.js`), proveyendo una API limpia y desacoplando la vista de la lógica de almacenamiento.

### 2. Evaluación: ¿Cuándo usar IndexedDB en lugar de `localStorage`?

Tras la investigación, se concluye que la elección entre `localStorage` e `IndexedDB` depende principalmente del **volumen y la complejidad de los datos** a almacenar:

*   **`localStorage`** es ideal para este proyecto porque:
    *   Los datos son simples (una lista de contactos en formato JSON).
    *   El volumen de datos es pequeño (limitado a unos 5-10 MB).
    *   La API es síncrona y muy fácil de usar para operaciones simples de clave-valor.

*   **`IndexedDB`** sería la elección preferida si la aplicación necesitara:
    *   **Almacenar grandes volúmenes de datos** (cientos de MB o más).
    *   **Realizar consultas complejas**, como filtrar contactos por ciudad o buscar por rangos de fechas, ya que permite la creación de índices para optimizar búsquedas.
    *   **Manejar transacciones** para garantizar la integridad de los datos en operaciones complejas.
    *   **Almacenar tipos de datos más complejos** que JSON, como archivos o blobs.

En resumen, para una aplicación CRUD simple como la de este portafolio, `localStorage` es la herramienta adecuada por su simplicidad y eficacia. `IndexedDB` es la solución para aplicaciones web offline más robustas y con mayores requerimientos de datos.

---

## ⚙️ Instrucciones de Uso

Dado que este es un proyecto web estático, no requiere un servidor ni un proceso de compilación para ejecutarse.

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    ```
2.  **Navegar a la carpeta del proyecto:**
    ```bash
    cd tu-repositorio
    ```
3.  **Abrir el archivo `index.html`:**
    *   Simplemente haz doble clic en el archivo `index.html` o arrástralo a tu navegador web preferido (Chrome, Firefox, Edge, etc.). La página se cargará y será completamente funcional.
