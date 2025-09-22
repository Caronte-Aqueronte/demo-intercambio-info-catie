/**
 * Representa un usuario registrado en el sistema (versión reducida).
 */
export interface UserLite {
  id: number;
  name: string;
  email: string;
}

/**
 * Representa un usuario registrado en el sistema.
 * Extiende la información de UserLite.
 */
export interface User extends UserLite {
  institution: string;
  role: string;
}
