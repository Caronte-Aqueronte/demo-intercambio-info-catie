import { Injectable } from '@angular/core';
import { ApiResponse } from '../model/api-response';

@Injectable({
  providedIn: 'root',
})
export class ErrorRenderService {

  /**
   * Genera un mensaje legible a partir de la respuesta de error de la API
   *
   * @param error respuesta de la API con success=false
   * @returns string con los errores concatenados por salto de línea
   */
  render(error: ApiResponse<any>): string {
    if (!error) {//valida que venga el campo errors
      return 'Ocurrió un error inesperado';
    }


    if (error.errors && error.errors.length > 0) {
      return error.errors.join('\n');
    }

    // fallback al mensaje general
    return error.message || 'Ocurrió un error inesperado';
  }
}
