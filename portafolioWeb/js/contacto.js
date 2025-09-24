/**
 * =================================================================
 * Script para la Sección de Contacto (contacto.js)
 * -----------------------------------------------------------------
 * Gestiona la lógica del formulario de contacto, incluyendo la
 * validación de campos, el almacenamiento de datos (CRUD) a través
 * de una fachada, y la interacción con componentes de UI como
 * el modal de confirmación y las notificaciones toast.
 * Este script es de tipo módulo, importando la fachada de contacto.
 * =================================================================
 * @module contacto
 */

import { ContactFacade } from './contact/facade/ContactFacade.js';

document.addEventListener('DOMContentLoaded', () => {

    /**
     * -----------------------------------------------------------------
     * 1. INICIALIZACIÓN Y REFERENCIAS AL DOM
     * -----------------------------------------------------------------
     * Se obtiene una única instancia de la fachada y se cachean todas
     * las referencias a elementos del DOM para un acceso eficiente.
     */

    const facade = new ContactFacade();

    // Referencias al formulario y sus elementos
    const form = document.getElementById('contact-form');
    const fieldsToValidate = form.querySelectorAll('input[required], select[required], textarea[required]');

    // Referencias a la lista de contactos
    const contactList = document.getElementById('contact-list');
    const contactItemTemplate = document.getElementById('contact-item-template');
    const borrarTodoBtn = document.getElementById('borrar-todo-btn');

    // Referencias a los componentes de UI (Modal y Toast)
    const modalOverlay = document.getElementById('custom-modal-overlay');
    const modalMessage = document.getElementById('modal-message');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    /** @type {number} */
    let toastTimeout; // ID del temporizador para las notificaciones toast.

    /**
     * -----------------------------------------------------------------
     * 2. LÓGICA DE RENDERIZADO Y MANIPULACIÓN DEL DOM
     * -----------------------------------------------------------------
     */

    /**
     * Renderiza la lista completa de contactos en la interfaz,
     * utilizando una plantilla HTML para cada ítem.
     * Muestra un mensaje si la lista está vacía.
     * @returns {void}
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
     * Carga los datos de un contacto existente en el formulario para su edición.
     * @param {string} id - El ID del contacto a editar.
     * @returns {void}
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
            window.location.hash = '#contacto'; // Desplaza la vista al formulario.
        }
    }

    /**
     * -----------------------------------------------------------------
     * 3. LÓGICA DE VALIDACIÓN DEL FORMULARIO
     * -----------------------------------------------------------------
     */

    /**
     * Muestra un mensaje de error visual para un campo específico.
     * @param {HTMLElement} field - El elemento del formulario que falló la validación.
     * @param {string} message - El mensaje de error a mostrar.
     */
    function showFieldError(field, message) {
        field.classList.add('is-invalid');
        const errorSpan = field.closest('.form-group').querySelector('.error-message');
        if (errorSpan) errorSpan.textContent = message;
    }

    /**
     * Limpia el mensaje de error visual de un campo.
     * @param {HTMLElement} field - El elemento del formulario.
     */
    function clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorSpan = field.closest('.form-group').querySelector('.error-message');
        if (errorSpan) errorSpan.textContent = '';
    }

    /**
     * Valida un único campo del formulario según sus atributos y tipo.
     * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field - El campo a validar.
     * @returns {boolean} - `true` si el campo es válido, `false` en caso contrario.
     */
    function validateField(field) {
        clearFieldError(field); // Limpia errores previos antes de revalidar.
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
     * Itera y valida todos los campos requeridos del formulario.
     * @returns {boolean} - `true` si todo el formulario es válido.
     */
    function validateForm() {
        let isFormValid = true;
        fieldsToValidate.forEach(field => {
            if (!validateField(field)) isFormValid = false;
        });
        return isFormValid;
    }

    /**
     * -----------------------------------------------------------------
     * 4. COMPONENTES DE UI PERSONALIZADOS (TOAST Y MODAL)
     * -----------------------------------------------------------------
     */

    /**
 * Muestra una notificación Toast en la pantalla.
 * @param {string} message - El mensaje a mostrar.
 * @param {'success'|'error'|'info'} [type='info'] - El tipo de notificación.
 */
    function showToast(message, type = 'info') {
        clearTimeout(toastTimeout);
        toastMessage.textContent = message;

        // ----- LA CORRECCIÓN ESTÁ AQUÍ -----
        // Restablece solo a la clase base, en lugar de borrar todo.
        toast.className = 'toast-notification';
        toastIcon.className = 'fas';
        // ------------------------------------

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
     * Muestra un modal de confirmación y devuelve una Promesa.
     * La promesa se resuelve a `true` si el usuario confirma, o `false` si cancela.
     * @param {string} message - La pregunta a mostrar en el modal.
     * @returns {Promise<boolean>} - La decisión del usuario.
     */
    function showConfirmationModal(message) {
        return new Promise(resolve => {
            modalMessage.textContent = message;
            modalOverlay.classList.remove('hidden');

            const cleanup = () => {
                modalConfirmBtn.removeEventListener('click', handleConfirm);
                modalCancelBtn.removeEventListener('click', handleCancel);
            };

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

            modalConfirmBtn.addEventListener('click', handleConfirm);
            modalCancelBtn.addEventListener('click', handleCancel);
        });
    }

    /**
     * -----------------------------------------------------------------
     * 5. MANEJADORES DE EVENTOS (EVENT LISTENERS)
     * -----------------------------------------------------------------
     */

    // Evento para el envío del formulario.
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

    // Evento para limpiar el formulario.
    form.addEventListener('reset', () => {
        fieldsToValidate.forEach(field => clearFieldError(field));
        form.querySelector('button[type="submit"]').textContent = 'Guardar Contacto';
        form.id.value = '';
    });

    // Evento 'blur' para validación en tiempo real al salir de un campo.
    fieldsToValidate.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
    });

    // Evento de clic en la lista de contactos (usando delegación de eventos).
    contactList.addEventListener('click', async (event) => {
        // --- CÓDIGO CORREGIDO ---
        // Busca el botón de editar o eliminar más cercano al clic.
        const editButton = event.target.closest('.edit-btn');
        const deleteButton = event.target.closest('.delete-btn');
        const contactItem = event.target.closest('.contact-item');

        // Si no se hizo clic dentro de un ítem de contacto, no hagas nada.
        if (!contactItem) return;

        const contactId = contactItem.dataset.id;

        // Si se encontró un botón de editar, ejecuta la edición.
        if (editButton) {
            editContact(contactId);
        }

        // Si se encontró un botón de eliminar, muestra el modal.
        if (deleteButton) {
            const confirmed = await showConfirmationModal('¿Estás seguro de que quieres eliminar este contacto?');
            if (confirmed) {
                facade.eliminarContacto(contactId);
                renderContactList();
                showToast('Contacto eliminado.', 'success');
            }
        }
    });

    // Evento para el botón de "Borrar Todo".
    borrarTodoBtn.addEventListener('click', async () => {
        const confirmed = await showConfirmationModal('¿Estás seguro de que quieres eliminar TODOS los contactos? Esta acción no se puede deshacer.');
        if (confirmed) {
            facade.borrarTodo();
            renderContactList();
            showToast('Todos los contactos han sido eliminados.', 'success');
        }
    });

    /**
     * -----------------------------------------------------------------
     * 6. EJECUCIÓN INICIAL
     * -----------------------------------------------------------------
     */

    // Renderiza la lista de contactos por primera vez al cargar la página.
    renderContactList();
});