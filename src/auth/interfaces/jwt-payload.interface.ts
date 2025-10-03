/**
 * JwtPayload: Interface que define la estructura del payload del token JWT
 *
 * Esta interface especifica qué datos se incluirán en el token JWT cuando
 * se genere y qué datos estarán disponibles cuando se decodifique.
 *
 * Campos incluidos:
 * - email: Identificador único del usuario para búsquedas en BD
 * - fullname: Nombre completo del usuario para mostrar en la UI
 *
 * Nota: No incluir datos sensibles como passwords o roles en el payload
 * ya que el JWT es decodificable por el cliente.
 */
export interface JwtPayload {
  email: string;
  fullname: string;
}
