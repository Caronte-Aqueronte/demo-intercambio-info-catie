import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import es from '@angular/common/locales/es';
import { routes } from './app.routes';
import * as AllIcons from '@ant-design/icons-angular/icons';

//imports necesarios para que zorro importe todos los iconos automaticamente
import { es_ES, NZ_I18N } from 'ng-zorro-antd/i18n';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { registerLocaleData } from '@angular/common';
import { provideToastr } from 'ngx-toastr';
import { jwtInterceptor } from './feature/common/interceptor/jwt-interceptor';

//inyecta todos los iconos de zorro
registerLocaleData(es);
const icons = AllIcons as {
  [key: string]: any;
};
const antDesignIcons = Object.keys(icons).map((key) => icons[key]);

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    //config de localizacion
     { provide: LOCALE_ID, useValue: 'es' },

    //registra los iconos de zorro como proveedores
    { provide: NZ_I18N, useValue: es_ES },
    { provide: NZ_ICONS, useValue: antDesignIcons },
    //
    provideAnimations(), // required animations providers
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }), // Toastr providers
  ],
};
