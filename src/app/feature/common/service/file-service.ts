import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  onDownload(url: string) {
    return this.http
      .get(url, {
        responseType: 'blob',
        observe: 'response', //permite acceder a headers
      })
      .subscribe((response) => {
        const blob = response.body as Blob;

        // Leer Content-Disposition del backend
        const contentDisposition = response.headers.get('content-disposition');
        let filename = 'archivox';

        if (contentDisposition) {
          console.log('entro');

          const match = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          );

          if (match != null && match[1]) {
            filename = match[1].replace(/['"]/g, '');
          }
        }

        // Forzar descarga
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(objectUrl);
      });
  }
}
