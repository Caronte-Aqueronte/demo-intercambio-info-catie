import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpStatusCode,
} from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../auth/service/auth-service';
import { inject } from '@angular/core';
import { LoginResult } from '../../auth/login/model/login-result';
import { ApiResponse } from '../model/api-response';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(environment.tokenClaimName);

  //inyecta servicio de auth para refrescar token
  const authService = inject(AuthService);

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // si es 401 y no estamos en login/refresh, intenta refrescar
      if (
        error.status === HttpStatusCode.Unauthorized &&
        !req.url.includes('/login') &&
        !req.url.includes('/refresh')
      ) {
        return authService.refreshToken().pipe(
          //copia la request original pero con el nuevo token
          switchMap((newToken: ApiResponse<LoginResult>) => {
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken.data!.token}` },
            });
            // reintenta la request original
            return next(retryReq);
          }),
          catchError((err) => {
            console.log(err);

            // si falla el refresh, cierrra sesión
            authService.logout();
            return throwError(() => err);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
