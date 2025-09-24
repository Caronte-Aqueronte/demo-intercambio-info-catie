import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { ApiFile } from '../../../common/model/api-file';
import { ApiResponse } from '../../../common/model/api-response';
import { UploadFilePayload } from '../../../common/model/upload-file-payload';
import { ErrorRenderService } from '../../../common/service/error-render-service';
import { MapService } from '../../service/map-service';

type UploadMapFormControls = {
  externalId: FormControl<string>;
  file: FormControl<File | null>;
};

@Component({
  selector: 'app-upload-map-form',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
  ],
  templateUrl: './upload-map-form.html',
})
export class UploadMapForm {
  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  uploading = false;
  acceptedTypes = '.shp,.geojson,.json,.kml,.kmz,.jpg,.jpeg,.png,.tiff';
  form: FormGroup<UploadMapFormControls>;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private mapService: MapService,
    private toastr: ToastrService,
    private errorRender: ErrorRenderService
  ) {
    this.form = this.createForm();
  }

  private createForm(): FormGroup<UploadMapFormControls> {
    return this.fb.group<UploadMapFormControls>({
      externalId: this.fb.control('', {
        validators: [Validators.required, Validators.maxLength(255)],
        nonNullable: true,
      }),
      file: this.fb.control<File | null>(null, {
        validators: [Validators.required],
      }),
    });
  }

  get fileControl() {
    return this.form.controls.file;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.fileControl.setValue(file);
    this.fileControl.markAsDirty();
    this.fileControl.markAsTouched();
    this.fileControl.updateValueAndValidity();
  }

  removeFile(): void {
    this.fileControl.setValue(null);
    this.fileControl.markAsPristine();
    this.fileControl.markAsUntouched();
    this.fileControl.updateValueAndValidity();
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  onCancel(): void {
    this.modalRef.destroy(false);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.error('Completa los datos del mapa');
      return;
    }

    const externalId = this.form.controls.externalId.value;
    const file = this.fileControl.value;

    if (!file) {
      this.toastr.error('Selecciona un archivo para subir');
      return;
    }

    const payload: UploadFilePayload = {
      externalId,
      file,
    };

    this.uploading = true;

    this.mapService
      .uploadMap(payload)
      .pipe(finalize(() => (this.uploading = false)))
      .subscribe({
        next: (response: ApiResponse<ApiFile>) => {
          if (response.success) {
            this.toastr.success('Mapa subido con éxito');
            this.modalRef.destroy(true);
            return;
          }

          this.toastr.error(response.message);
        },
        error: (err) => {
          this.toastr.error(this.errorRender.render(err.error));
        },
      });
  }

  get selectedFileName(): string | null {
    return this.fileControl.value?.name ?? null;
  }
}
