/**
 * Gestiona toda la lógica de persistencia (guardado, lectura, etc.) de los contactos.
 * Su única responsabilidad es interactuar con el almacenamiento del navegador (localStorage).
 * No sabe nada sobre la interfaz de usuario, formularios o validaciones.
 */
export class ContactRepository {
    constructor() {
        // La clave bajo la cual guardaremos toda nuestra lista de contactos en localStorage.
        this._storageKey = 'contactosConFramework';
    }

    /**
     * Lee los datos crudos de localStorage y los convierte en un array de objetos.
     * @private
     * @returns {Array<object>} La lista de contactos o un array vacío si no hay nada.
     */
    _readStorage() {
        const data = localStorage.getItem(this._storageKey);
        return data ? JSON.parse(data) : [];
    }

    /**
     * Toma un array de contactos, lo convierte a una cadena JSON y lo guarda en localStorage.
     * @private
     * @param {Array<object>} contacts - La lista de contactos a guardar.
     */
    _writeStorage(contacts) {
        localStorage.setItem(this._storageKey, JSON.stringify(contacts));
    }

    /**
     * Devuelve todos los contactos almacenados.
     * @returns {Array<object>}
     */
    getAll() {
        return this._readStorage();
    }

    /**
     * Busca y devuelve un contacto por su ID.
     * @param {string} id - El ID del contacto a buscar.
     * @returns {object | undefined} El contacto encontrado o undefined si no existe.
     */
    getById(id) {
        const contacts = this._readStorage();
        return contacts.find(contact => contact.id === id);
    }

    /**
     * Agrega un nuevo contacto a la lista.
     * @param {object} contact - El objeto de contacto a agregar.
     */
    add(contact) {
        const contacts = this._readStorage();
        contacts.push(contact);
        this._writeStorage(contacts);
    }

    /**
     * Actualiza un contacto existente en la lista.
     * @param {object} updatedContact - El objeto de contacto con los datos actualizados.
     */
    update(updatedContact) {
        let contacts = this._readStorage();
        // Creamos un nuevo array reemplazando el contacto antiguo por el actualizado.
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
        // Creamos un nuevo array que excluye el contacto con el ID a eliminar.
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