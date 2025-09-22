/**
 * DTO genérico que representa cualquier respuesta de la API REST.
 */
export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
  errors?: string[];
}
