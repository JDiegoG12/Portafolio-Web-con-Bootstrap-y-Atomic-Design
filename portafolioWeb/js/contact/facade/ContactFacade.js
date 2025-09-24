import { Contacto } from '../domain/Contacto.js';
import { ContactRepository } from '../repository/ContactRepository.js';

/**
 * Proporciona una interfaz simple y de alto nivel para interactuar con el sistema de contactos.
 * Es el único punto de entrada para la lógica de la interfaz de usuario.
 * Oculta la complejidad interna del Modelo y el Repositorio.
 */
export class ContactFacade {
    constructor() {
        // La Fachada crea y gestiona su propia instancia del Repositorio.
        this._repository = new ContactRepository();
    }

    /**
     * Guarda un contacto. Decide si es una operación de creación o de actualización
     * basándose en la presencia de un ID en los datos del formulario.
     * @param {object} formData - Los datos crudos provenientes del formulario.
     */
    guardarContacto(formData) {
        if (formData.id) {
            // --- Lógica de Actualización ---
            // 1. Obtenemos el contacto original para no perder la fecha de creación.
            const contactoExistente = this._repository.getById(formData.id);
            if (!contactoExistente) {
                console.error(`Error: No se encontró un contacto con el ID ${formData.id} para actualizar.`);
                return;
            }

            // 2. Creamos un nuevo objeto de datos que combina la fecha de creación original
            //    con los nuevos datos del formulario.
            const datosActualizados = {
                ...formData,
                fechaCreacion: contactoExistente.fechaCreacion, // Mantenemos la fecha original
            };

            // 3. Creamos una nueva instancia del modelo Contacto para asegurar la estructura
            //    y actualizar la fecha de modificación.
            const contactoActualizado = new Contacto(datosActualizados);

            // 4. Le pedimos al repositorio que lo actualice.
            this._repository.update(contactoActualizado);

        } else {
            // --- Lógica de Creación ---
            // 1. Creamos una nueva instancia del modelo Contacto.
            //    El constructor se encargará de generar el ID y las fechas.
            const nuevoContacto = new Contacto(formData);

            // 2. Le pedimos al repositorio que lo agregue.
            this._repository.add(nuevoContacto);
        }
    }

    /**
     * Devuelve una lista de todos los contactos.
     * @returns {Array<object>}
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
     * @returns {object | undefined}
     */
    obtenerContactoParaEditar(id) {
        return this._repository.getById(id);
    }
}