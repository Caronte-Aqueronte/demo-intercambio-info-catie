import { CommonModule } from '@angular/common';
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
import { ApiFile } from '../../../common/model/api-file';
import { ApiResponse } from '../../../common/model/api-response';
import { ErrorRenderService } from '../../../common/service/error-render-service';
import { FileService } from '../../../common/service/file-service';
import { MapService } from '../../service/map-service';
import { UploadMapForm } from '../upload-map-form/upload-map-form';

@Component({
  selector: 'app-map-page',
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
  templateUrl: './map-page.html',
  styleUrl: './map-page.css',
})
export class MapPage implements OnInit {
  maps: ApiFile[] = [];
  loading = false;

  constructor(
    private mapService: MapService,
    private toastr: ToastrService,
    private render: ErrorRenderService,
    private modalService: NzModalService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.fetchMaps();
  }

  private fetchMaps(): void {
    this.loading = true;
    this.mapService.getAllMaps().subscribe({
      next: (response: ApiResponse<ApiFile[]>) => {
        if (response.success && response.data) {
          this.maps = response.data;
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

  onCreateMap(): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Subir mapa',
      nzContent: UploadMapForm,
      nzCentered: true,
      nzWidth: 600,
    });

    modalRef.afterClose.subscribe((result) => {
      if (result) {
        this.fetchMaps();
      }
    });
  }

  onDownload(url: string): void {
    this.fileService.onDownload(url);
  }
}
