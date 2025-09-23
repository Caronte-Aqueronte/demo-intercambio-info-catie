import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { LoginResult } from '../login/model/login-result';
import { Login } from '../login/model/login';
import { ApiResponse } from '../../common/model/api-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginPath = environment.apiUrl + '/v1/login';
  private refreshTokenPath = environment.apiUrl + '/v1/refresh';
  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Realiza la petición de inicio de sesión contra el backend.
   *
   * @param body DTO con email y password
   * @returns Observable<LoginResponseDTO> con los datos del usuario autenticado
   */
  public login(body: Login): Observable<ApiResponse<LoginResult>> {
    return this.http
      .post<ApiResponse<LoginResult>>(`${this.loginPath}`, body)
      .pipe(
        tap((resp: ApiResponse<LoginResult>) => {
          this.saveSession(resp.data!); //guarda en el localstorage la sesion
        })
      );
  }

  public refreshToken(): Observable<ApiResponse<LoginResult>> {
    return this.http
      .post<ApiResponse<LoginResult>>(`${this.refreshTokenPath}`, {})
      .pipe(
        tap((resp: ApiResponse<LoginResult>) => {
          this.saveSession(resp.data!); //guarda en el localstorage la sesion
        })
      );
  }

  public getUserName(): String {
    return localStorage.getItem(environment.clientNameClaimName)!;
  }

  /**
   * Elimina los datos de sesión del almacenamiento local y redirige al login.
   */
  public logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  /**
   * Persiste los datos de sesión (token, rol, userId) en el almacenamiento local.
   *
   * @param resp objeto con la respuesta del backend al iniciar sesión
   */
  private saveSession(resp: LoginResult) {
    localStorage.setItem(environment.tokenClaimName, resp.token);
    localStorage.setItem(environment.roleClaimName, resp.user.role);
    localStorage.setItem(environment.userClaimId, resp.user.id.toString());
    localStorage.setItem(environment.clientNameClaimName, resp.user.name);
  }
}
