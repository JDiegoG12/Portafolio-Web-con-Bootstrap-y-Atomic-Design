/**
 * =================================================================================
 * Archivo:      app.js
 * Proyecto:     Portafolio Personal - Sofía Arango y Juan Diego Gómez
 * Descripción:  Este archivo es el punto de entrada principal para toda la
 *               lógica de JavaScript del sitio. Contiene el código combinado
 *               para la funcionalidad global (navegación, animaciones) y la
 *               lógica de la aplicación de contacto (CRUD).
 * Arquitectura: La sección de contacto sigue un patrón de diseño en capas:
 *               - Modelo (Contacto): Define la estructura de los datos.
 *               - Repositorio (ContactRepository): Maneja la persistencia de datos.
 *               - Fachada (ContactFacade): Proporciona una API simple para la UI.
 *               - Vista/Controlador (lógica en DOMContentLoaded): Maneja la UI y
 *                 los eventos del usuario.
 * @autores      Sofía Arango Yanza y Juan Diego Gómez
 * =================================================================================
 */

// =================================================================================
// SECCIÓN 1: LÓGICA GLOBAL DEL SITIO
// =================================================================================

document.addEventListener('DOMContentLoaded', function () {

    /**
     * Gestiona el cambio de apariencia del encabezado al hacer scroll.
     * Añade o quita la clase 'scrolled' basándose en la posición del scroll vertical.
     */
    const header = document.querySelector('.header-container');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Ejecuta al cargar para el estado inicial
    }

    /**
     * Implementa "scroll spying" para actualizar el enlace activo en la navegación.
     * Resalta el enlace de navegación correspondiente a la sección visible en pantalla.
     */
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section');
    window.addEventListener('scroll', () => {
        let currentSectionId = 'inicio';
        const headerHeight = header ? header.offsetHeight : 80;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - headerHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    });

    /**
     * Inicializa la librería AOS (Animate On Scroll) para las animaciones.
     */
    AOS.init({
        duration: 800, // Duración de la animación en ms
        once: true,    // La animación solo ocurre una vez
        offset: 50,    // Se activa 50px antes de que el elemento sea visible
    });
});


// =================================================================================
// SECCIÓN 2: MODELO DE DATOS (Clase Contacto)
// =================================================================================

/**
 * Representa la estructura de un contacto. Es el Modelo (Model) de la aplicación,
 * definiendo la forma y las propiedades de los datos de contacto.
 */
class Contacto {
    /**
     * Crea una instancia de un Contacto.
     * @param {object} data - Un objeto con los datos del contacto, usualmente desde un formulario.
     * @param {string} [data.id] - El ID del contacto (opcional, se genera si no existe para un nuevo contacto).
     * @param {string} data.nombre - El nombre del contacto.
     * @param {string} data.email - El email del contacto.
     * @param {string} data.telefono - El teléfono del contacto.
     * @param {string} data.motivo - El motivo del contacto.
     * @param {string} data.mensaje - El mensaje del contacto.
     * @param {boolean} data.aceptaTerminos - Si el usuario aceptó los términos.
     * @param {string} data.preferenciaContacto - El método de contacto preferido ('email' o 'telefono').
     * @param {string} [data.fechaCreacion] - La fecha de creación (opcional, se mantiene en actualizaciones).
     */
    constructor(data) {
        /** @type {string} */
        this.id = data.id || crypto.randomUUID();
        /** @type {string} */
        this.nombre = data.nombre;
        /** @type {string} */
        this.email = data.email;
        /** @type {string} */
        this.telefono = data.telefono;
        /** @type {string} */
        this.motivo = data.motivo;
        /** @type {string} */
        this.mensaje = data.mensaje;
        /** @type {boolean} */
        this.aceptaTerminos = data.aceptaTerminos;
        /** @type {string} */
        this.preferenciaContacto = data.preferenciaContacto;

        const ahora = new Date().toISOString();
        /** @type {string} */
        this.fechaCreacion = data.fechaCreacion || ahora;
        /** @type {string} */
        this.fechaActualizacion = ahora; // Siempre se actualiza al crear o modificar.
    }
}

// =================================================================================
// SECCIÓN 3: CAPA DE PERSISTENCIA (ContactRepository)
// =================================================================================

/**
 * Gestiona la lógica de persistencia (guardado, lectura, etc.) de los contactos.
 * Su única responsabilidad es interactuar con el almacenamiento del navegador (localStorage).
 */
class ContactRepository {
    constructor() {
        /**
         * La clave bajo la cual se guarda la lista de contactos en localStorage.
         * @private
         * @type {string}
         */
        this._storageKey = 'contactosConFramework';
    }

    /**
     * Lee y parsea los datos desde localStorage.
     * @private
     * @returns {Array<Contacto>} La lista de contactos o un array vacío.
     */
    _readStorage() {
        const data = localStorage.getItem(this._storageKey);
        return data ? JSON.parse(data) : [];
    }

    /**
     * Escribe la lista de contactos en localStorage.
     * @private
     * @param {Array<Contacto>} contacts - La lista de contactos a guardar.
     */
    _writeStorage(contacts) {
        localStorage.setItem(this._storageKey, JSON.stringify(contacts));
    }

    /**
     * Devuelve todos los contactos almacenados.
     * @returns {Array<Contacto>}
     */
    getAll() {
        return this._readStorage();
    }

    /**
     * Busca y devuelve un contacto por su ID.
     * @param {string} id - El ID del contacto a buscar.
     * @returns {Contacto | undefined} El contacto encontrado o undefined si no existe.
     */
    getById(id) {
        const contacts = this._readStorage();
        return contacts.find(contact => contact.id === id);
    }

    /**
     * Agrega un nuevo contacto a la lista.
     * @param {Contacto} contact - El objeto de contacto a agregar.
     */
    add(contact) {
        const contacts = this._readStorage();
        contacts.push(contact);
        this._writeStorage(contacts);
    }

    /**
     * Actualiza un contacto existente en la lista.
     * @param {Contacto} updatedContact - El objeto de contacto con los datos actualizados.
     */
    update(updatedContact) {
        let contacts = this._readStorage();
        contacts = contacts.map(contact =>
            contact.id === updatedContact.id ? updatedContact : contact
        );
        this._writeStorage(contacts);
    }

    /**
     * Elimina un contacto de la lista por su ID.
     * @param {string} id - El ID del contacto a eliminar.
     */
    remove(id) {
        let contacts = this._readStorage();
        contacts = contacts.filter(contact => contact.id !== id);
        this._writeStorage(contacts);
    }

    /**
     * Elimina todos los contactos del almacenamiento.
     */
    clear() {
        localStorage.removeItem(this._storageKey);
    }
}

// =================================================================================
// SECCIÓN 4: FACHADA DE SERVICIOS (ContactFacade)
// =================================================================================

/**
 * Proporciona una interfaz simple y de alto nivel (Fachada) para interactuar
 * con el sistema de contactos. Es el único punto de entrada para la lógica de la UI,
 * ocultando la complejidad del Modelo y el Repositorio.
 */
class ContactFacade {
    constructor() {
        /**
         * @private
         * @type {ContactRepository}
         */
        this._repository = new ContactRepository();
    }

    /**
     * Guarda un contacto, manejando tanto la creación como la actualización.
     * @param {object} formData - Los datos crudos provenientes del formulario.
     */
    guardarContacto(formData) {
        if (formData.id) { // Lógica de Actualización
            const contactoExistente = this._repository.getById(formData.id);
            if (!contactoExistente) {
                console.error(`Error: No se encontró un contacto con el ID ${formData.id} para actualizar.`);
                return;
            }
            const datosActualizados = {
                ...formData,
                fechaCreacion: contactoExistente.fechaCreacion, // Mantiene la fecha original
            };
            const contactoActualizado = new Contacto(datosActualizados);
            this._repository.update(contactoActualizado);
        } else { // Lógica de Creación
            const nuevoContacto = new Contacto(formData);
            this._repository.add(nuevoContacto);
        }
    }

    /**
     * Devuelve una lista de todos los contactos.
     * @returns {Array<Contacto>}
     */
    listarContactos() {
        return this._repository.getAll();
    }

    /**
     * Elimina un contacto específico por su ID.
     * @param {string} id - El ID del contacto a eliminar.
     */
    eliminarContacto(id) {
        this._repository.remove(id);
    }

    /**
     * Elimina todos los contactos existentes.
     */
    borrarTodo() {
        this._repository.clear();
    }

    /**
     * Obtiene los datos de un contacto para poder editarlo.
     * @param {string} id - El ID del contacto a obtener.
     * @returns {Contacto | undefined}
     */
    obtenerContactoParaEditar(id) {
        return this._repository.getById(id);
    }
}


// =================================================================================
// SECCIÓN 5: LÓGICA DE LA INTERFAZ DE USUARIO (UI) - SECCIÓN CONTACTO
// =================================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Se ejecuta solo si el formulario de contacto existe en la página actual.
    if (document.getElementById('contact-form')) {

        // --- 1. Inicialización y Cacheo de Elementos del DOM ---
        const facade = new ContactFacade();
        const form = document.getElementById('contact-form');
        const fieldsToValidate = form.querySelectorAll('input[required], select[required], textarea[required]');
        const contactList = document.getElementById('contact-list');
        const contactItemTemplate = document.getElementById('contact-item-template');
        const borrarTodoBtn = document.getElementById('borrar-todo-btn');
        const modalOverlay = document.getElementById('custom-modal-overlay');
        const modalMessage = document.getElementById('modal-message');
        const modalConfirmBtn = document.getElementById('modal-confirm-btn');
        const modalCancelBtn = document.getElementById('modal-cancel-btn');
        const toast = document.getElementById('toast-notification');
        const toastMessage = document.getElementById('toast-message');
        const toastIcon = document.getElementById('toast-icon');
        /** @type {number} */
        let toastTimeout;

        // --- 2. Lógica de Renderizado y Manipulación del DOM ---

        /**
         * Renderiza la lista completa de contactos en la UI.
         */
        function renderContactList() {
            contactList.innerHTML = '';
            const contacts = facade.listarContactos();
            if (contacts.length === 0) {
                const li = document.createElement('li');
                li.textContent = 'No hay contactos guardados.';
                li.classList.add('empty-message');
                contactList.appendChild(li);
                return;
            }
            contacts.forEach(contact => {
                const clone = contactItemTemplate.content.cloneNode(true);
                const li = clone.querySelector('.contact-item');
                li.dataset.id = contact.id;
                clone.querySelector('.contact-name').textContent = contact.nombre;
                clone.querySelector('.contact-email').textContent = contact.email;
                clone.querySelector('.contact-phone').textContent = contact.telefono || 'N/A';
                const fecha = new Date(contact.fechaActualizacion);
                clone.querySelector('.contact-date').textContent = `Última act.: ${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}`;
                contactList.appendChild(clone);
            });
        }

        /**
         * Carga los datos de un contacto en el formulario para su edición.
         * @param {string} id - El ID del contacto a editar.
         */
        function editContact(id) {
            const contact = facade.obtenerContactoParaEditar(id);
            if (contact) {
                form.id.value = contact.id;
                form.nombre.value = contact.nombre;
                form.email.value = contact.email;
                form.telefono.value = contact.telefono;
                form.motivo.value = contact.motivo;
                form.mensaje.value = contact.mensaje;
                form.aceptaTerminos.checked = contact.aceptaTerminos;
                form.querySelector(`input[name="preferenciaContacto"][value="${contact.preferenciaContacto}"]`).checked = true;
                form.querySelector('button[type="submit"]').textContent = 'Actualizar Contacto';
                window.location.hash = '#contacto'; // Desplaza la vista al formulario
            }
        }

        // --- 3. Lógica de Validación del Formulario ---

        /**
         * Muestra un mensaje de error visual para un campo.
         * @param {HTMLElement} field - El elemento del formulario.
         * @param {string} message - El mensaje de error.
         */
        function showFieldError(field, message) {
            field.classList.add('is-invalid');
            const errorSpan = field.closest('.form-group').querySelector('.error-message');
            if (errorSpan) errorSpan.textContent = message;
        }

        /**
         * Limpia el mensaje de error de un campo.
         * @param {HTMLElement} field - El elemento del formulario.
         */
        function clearFieldError(field) {
            field.classList.remove('is-invalid');
            const errorSpan = field.closest('.form-group').querySelector('.error-message');
            if (errorSpan) errorSpan.textContent = '';
        }

        /**
         * Valida un único campo del formulario.
         * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field - El campo a validar.
         * @returns {boolean} `true` si el campo es válido.
         */
        function validateField(field) {
            clearFieldError(field);
            let isValid = true;
            if (field.type === 'checkbox') {
                if (!field.checked) {
                    showFieldError(field, 'Debes aceptar los términos y condiciones.');
                    isValid = false;
                }
            } else {
                const value = field.value.trim();
                if (!value) {
                    showFieldError(field, 'Este campo es obligatorio.');
                    isValid = false;
                } else if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
                    showFieldError(field, 'El formato del email no es válido.');
                    isValid = false;
                } else if (field.id === 'telefono' && !/^\d{10}$/.test(value)) {
                    showFieldError(field, 'El teléfono debe contener 10 dígitos.');
                    isValid = false;
                }
            }
            return isValid;
        }

        /**
         * Valida todos los campos requeridos del formulario.
         * @returns {boolean} `true` si todo el formulario es válido.
         */
        function validateForm() {
            let isFormValid = true;
            fieldsToValidate.forEach(field => {
                if (!validateField(field)) isFormValid = false;
            });
            return isFormValid;
        }

        // --- 4. Componentes de UI Personalizados ---

        /**
         * Muestra una notificación Toast.
         * @param {string} message - El mensaje a mostrar.
         * @param {'success'|'error'|'info'} [type='info'] - El tipo de notificación.
         */
        function showToast(message, type = 'info') {
            clearTimeout(toastTimeout);
            toastMessage.textContent = message;
            toast.className = 'toast-notification';
            toastIcon.className = 'fas';
            if (type === 'success') {
                toast.classList.add('success');
                toastIcon.classList.add('fa-check-circle');
            } else if (type === 'error') {
                toast.classList.add('error');
                toastIcon.classList.add('fa-exclamation-circle');
            } else {
                toastIcon.classList.add('fa-info-circle');
            }
            toast.classList.add('show');
            toastTimeout = setTimeout(() => toast.classList.remove('show'), 4000);
        }

        /**
         * Muestra un modal de confirmación y devuelve una Promesa con la decisión del usuario.
         * @param {string} message - La pregunta a mostrar en el modal.
         * @returns {Promise<boolean>} Resuelve a `true` si se confirma, `false` si se cancela.
         */
        function showConfirmationModal(message) {
            return new Promise(resolve => {
                modalMessage.textContent = message;
                modalOverlay.classList.remove('hidden');
                const handleConfirm = () => {
                    modalOverlay.classList.add('hidden');
                    cleanup();
                    resolve(true);
                };
                const handleCancel = () => {
                    modalOverlay.classList.add('hidden');
                    cleanup();
                    resolve(false);
                };
                const cleanup = () => {
                    modalConfirmBtn.removeEventListener('click', handleConfirm);
                    modalCancelBtn.removeEventListener('click', handleCancel);
                };
                modalConfirmBtn.addEventListener('click', handleConfirm);
                modalCancelBtn.addEventListener('click', handleCancel);
            });
        }

        // --- 5. Manejadores de Eventos (Event Listeners) ---

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!validateForm()) {
                showToast('Por favor, corrige los errores del formulario.', 'error');
                return;
            }
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data.aceptaTerminos = form.aceptaTerminos.checked;
            const isUpdating = !!data.id;
            facade.guardarContacto(data);
            showToast(isUpdating ? '¡Contacto actualizado con éxito!' : '¡Contacto guardado con éxito!', 'success');
            form.reset();
            renderContactList();
        });

        form.addEventListener('reset', () => {
            fieldsToValidate.forEach(field => clearFieldError(field));
            form.querySelector('button[type="submit"]').textContent = 'Guardar Contacto';
            form.id.value = '';
        });

        fieldsToValidate.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
        });

        contactList.addEventListener('click', async (event) => {
            const editButton = event.target.closest('.edit-btn');
            const deleteButton = event.target.closest('.delete-btn');
            const contactItem = event.target.closest('.contact-item');
            if (!contactItem) return;
            const contactId = contactItem.dataset.id;
            if (editButton) {
                editContact(contactId);
            }
            if (deleteButton) {
                const confirmed = await showConfirmationModal('¿Estás seguro de que quieres eliminar este contacto?');
                if (confirmed) {
                    facade.eliminarContacto(contactId);
                    renderContactList();
                    showToast('Contacto eliminado.', 'success');
                }
            }
        });

        borrarTodoBtn.addEventListener('click', async () => {
            const confirmed = await showConfirmationModal('¿Estás seguro de que quieres eliminar TODOS los contactos? Esta acción no se puede deshacer.');
            if (confirmed) {
                facade.borrarTodo();
                renderContactList();
                showToast('Todos los contactos han sido eliminados.', 'success');
            }
        });

        // --- 6. Ejecución Inicial ---
        renderContactList();
    }
});