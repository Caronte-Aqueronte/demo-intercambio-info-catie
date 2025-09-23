import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../common/service/error-render-service';

import { finalize } from 'rxjs';
import { MapService } from '../../service/map-service';

import { ApiResponse } from '../../../common/model/api-response';
import { ApiFile } from '../../../common/model/api-file';
import { HttpErrorResponse } from '@angular/common/http';
import { UploadFilePayload } from '../../../common/model/upload-file-payload';
@Component({
  selector: 'app-upload-map-page',
  imports: [
    CommonModule,
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
  ],
  templateUrl: './upload-map-page.html',
  styleUrl: './upload-map-page.css',
})
export class UploadMapPage {
  private fb = inject(FormBuilder);

  private modalRef = inject(NzModalRef);
  private mapsService = inject(MapService);
  private toastr = inject(ToastrService);
  private errorRender = inject(ErrorRenderService);

  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  uploading = false;
  acceptedTypes = '.pdf,.doc,.docx,.xls,.xlsx,.jpeg,.jpg,.png,.gif,.tiff';

  form = this.fb.group({
    externalId: this.fb.control('', {
      validators: [Validators.required, Validators.maxLength(255)],
      nonNullable: true,
    }),
    file: this.fb.control<File | null>(null, {
      validators: [Validators.required],
    }),
  });

  get fileControl() {
    return this.form.controls.file;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.form.patchValue({ file });
    this.fileControl.markAsDirty();
    this.fileControl.markAsTouched();
    this.fileControl.updateValueAndValidity();
  }

  removeFile(): void {
    this.form.patchValue({ file: null });
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
      this.toastr.error('Completa los datos del documento');
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

    this.mapsService
      .uploadMap(payload)
      .pipe(finalize(() => (this.uploading = false)))
      .subscribe({
        next: (response: ApiResponse<ApiFile>) => {
          this.toastr.success(response.message);
          this.modalRef.destroy(true);
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error(this.errorRender.render(err.error));
        },
      });
  }

  get selectedFileName(): string | null {
    return this.fileControl.value?.name ?? null;
  }
}
