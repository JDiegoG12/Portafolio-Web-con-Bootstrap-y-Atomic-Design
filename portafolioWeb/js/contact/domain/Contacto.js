/**
 * Representa la estructura de un contacto.
 * Es el Modelo de nuestra aplicación, define la forma de nuestros datos.
 */
export class Contacto {
    /**
     * @param {object} data - Un objeto con los datos del contacto, usualmente desde un formulario.
     * @param {string} [data.id] - El ID del contacto (opcional, se genera si no existe).
     * @param {string} data.nombre - El nombre del contacto.
     * @param {string} data.email - El email del contacto.
     * @param {string} data.telefono - El teléfono del contacto.
     * @param {string} data.motivo - El motivo del contacto.
     * @param {string} data.mensaje - El mensaje del contacto.
     * @param {boolean} data.aceptaTerminos - Si el usuario aceptó los términos.
     * @param {string} data.preferenciaContacto - 'email' o 'telefono'.
     * @param {string} [data.fechaCreacion] - La fecha de creación (opcional, se genera si es nuevo).
     */
    constructor(data) {
        // Usamos un ID existente (para actualizaciones) o generamos uno nuevo.
        // `crypto.randomUUID()` es la forma moderna y segura de crear IDs únicos.
        this.id = data.id || crypto.randomUUID();

        this.nombre = data.nombre;
        this.email = data.email;
        this.telefono = data.telefono;
        this.motivo = data.motivo;
        this.mensaje = data.mensaje;
        this.aceptaTerminos = data.aceptaTerminos;
        this.preferenciaContacto = data.preferenciaContacto;

        // Usamos una fecha existente o creamos una nueva en formato ISO (estándar y fácil de ordenar).
        const ahora = new Date().toISOString();
        this.fechaCreacion = data.fechaCreacion || ahora;
        this.fechaActualizacion = ahora; // Siempre se actualiza al crear o modificar.
    }
}