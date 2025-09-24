import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiFile } from '../../common/model/api-file';
import { ApiResponse } from '../../common/model/api-response';
import { UploadFilePayload } from '../../common/model/upload-file-payload';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private path = environment.apiUrl + '/v1/documents';

  constructor(private http: HttpClient) {}

  getAllDocuments(): Observable<ApiResponse<ApiFile[]>> {
    return this.http.get<ApiResponse<ApiFile[]>>(this.path);
  }

  uploadDocument(payload: UploadFilePayload): Observable<ApiResponse<ApiFile>> {
    const formData = new FormData();
    formData.append('external_id', payload.externalId);
    formData.append('file', payload.file);

    return this.http.post<ApiResponse<ApiFile>>(this.path, formData);
  }
}
