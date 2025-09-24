import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../common/service/error-render-service';
import { ApiFile } from '../../../common/model/api-file';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../service/document-service';
import { ApiResponse } from '../../../common/model/api-response';
import { UploadDocumentForm } from '../upload-document-form/upload-document-form';
import { FileService } from '../../../common/service/file-service';

@Component({
  selector: 'app-document-page',
  imports: [
    NzDividerModule,
    NzTableModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzModalModule,
    NzSelectModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './document-page.html',
  styleUrl: './document-page.css',
})
export class DocumentPage implements OnInit {
  documents: ApiFile[] = [];
  loading = false;
  constructor(
    private modalService: NzModalService,
    private render: ErrorRenderService,
    private toastr: ToastrService,
    private documentService: DocumentService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.fetchDocuments();
  }

  private fetchDocuments(): void {
    this.loading = true;
    this.documentService.getAllDocuments().subscribe({
      next: (response: ApiResponse<ApiFile[]>) => {
        if (response.success && response.data) {
          this.documents = response.data;
        } else {
          this.toastr.error(response.message);
        }
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(this.render.render(err.error));
        this.loading = false;
      },
    });
  }

  onDownload(url: string) {
    this.fileService.onDownload(url);
  }

  onCreateDocument(): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Subir documento',
      nzContent: UploadDocumentForm,
      nzCentered: true,
      nzWidth: 600,
    });

    modalRef.afterClose.subscribe((result) => {
      if (result) {
        this.fetchDocuments();
      }
    });
  }
}
