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
import { DocumentService } from '../../service/document-service';

type UploadDocumentFormControls = {
  externalId: FormControl<string>;
  file: FormControl<File | null>;
};

@Component({
  selector: 'app-upload-document-form',
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
  templateUrl: './upload-document-form.html',
})
export class UploadDocumentForm {
  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  uploading = false;
  acceptedTypes = '.pdf,.doc,.docx,.xls,.xlsx,.jpeg,.jpg,.png,.gif,.tiff';
  form: FormGroup<UploadDocumentFormControls>;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private documentService: DocumentService,
    private toastr: ToastrService,
    private errorRender: ErrorRenderService
  ) {
    this.form = this.createForm();
  }

  private createForm(): FormGroup<UploadDocumentFormControls> {
    return this.fb.group<UploadDocumentFormControls>({
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

    this.documentService
      .uploadDocument(payload)
      .pipe(finalize(() => (this.uploading = false)))
      .subscribe({
        next: (response: ApiResponse<ApiFile>) => {
          if (response.success) {
            this.toastr.success('Documento subido con éxito');
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
