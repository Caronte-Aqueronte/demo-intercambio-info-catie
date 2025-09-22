import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../service/auth-service';
import { ErrorRenderService } from '../../../../common/service/error-render-service';
import { Login } from '../../model/login';
import { ApiResponse } from '../../../../common/model/api-response';
import { LoginResult } from '../../model/login-result';

@Component({
  selector: 'app-login-page',
  imports: [
    NzInputModule,
    NzFormModule,
    NzIconModule,
    NzButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  passwordVisible = false;

  // inyecta el formBuilder
  private fb = inject(NonNullableFormBuilder);

  // definicion del formulario
  formLogin = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(64)],
    ],
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private errorRenderService: ErrorRenderService
  ) {}

  /**
   * Envía las credenciales del formulario al servicio de autenticación.
   */
  login(): void {
    if (this.formLogin.invalid) {
      this.toastr.error('Por favor completa todos los campos obligatorios.');
      return;
    }

    // construye el objeto Login a partir del formulario
    const body: Login = {
      email: this.formLogin.get('email')!.value,
      password: this.formLogin.get('password')!.value,
    };

    this.authService.login(body).subscribe({
      next: (resp: ApiResponse<LoginResult>) => {
        // redirige según el rol del usuario autenticado
        this.redirect(resp.data!.user.role);
      },
      error: (err) => {
        console.log(err);

        // muestra los errores usando el servicio centralizado
        this.toastr.error(this.errorRenderService.render(err.error));
      },
    });
  }

  /**
   * redirige al usuario segun su rol
   *
   * @param role rol del usuario
   */
  private redirect(role: string) {
    switch (role) {
      case 'admin':
        this.router.navigate(['/dashboard/']);
        break;
      default:
        this.toastr.error(
          'No se reconoce tu rol de usuario. Por favor, contacta al área de Administración para obtener acceso.',
          'Acceso no disponible'
        );
        return;
    }
  }
}
