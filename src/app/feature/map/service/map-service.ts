import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../common/model/api-response';
import { ApiFile } from '../../common/model/api-file';
import { UploadFilePayload } from '../../common/model/upload-file-payload';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private path = environment.apiUrl + '/v1/maps';

  constructor(private http: HttpClient) {}

  getAllMaps(): Observable<ApiResponse<ApiFile[]>> {
    return this.http.get<ApiResponse<ApiFile[]>>(this.path);
  }

  uploadMap(payload: UploadFilePayload): Observable<ApiResponse<ApiFile>> {
    const formData = new FormData();
    formData.append('external_id', payload.externalId);
    formData.append('file', payload.file);
    return this.http.post<ApiResponse<ApiFile>>(this.path, formData);
  }
}
