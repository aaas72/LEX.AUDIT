import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroDocumentArrowUp } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-upload-zone',
  standalone: true,
  imports: [CommonModule, NgIconComponent, TranslatePipe],
  providers: [provideIcons({ heroDocumentArrowUp })],
  templateUrl: './upload-zone.component.html',
  styles: ``
})
export class UploadZoneComponent {
  @Output() fileSelected = new EventEmitter<File>();
  isDragging = false;
  private translate = inject(TranslateService);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.handleFile(file);
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.handleFile(file);
    }
  }

  uploadStep = 0;
  uploadStatus = '';
  errorMessage = '';

  private handleFile(file: File) {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      this.errorMessage = this.translate.instant('AUDIT.UPLOAD.ERROR_PDF_ONLY');
      return;
    }
    
    this.errorMessage = '';
    this.uploadStep = 1;
    this.uploadStatus = this.translate.instant('AUDIT.UPLOAD.STATUS_VERIFYING');
    
    setTimeout(() => {
      this.uploadStep = 2;
      this.uploadStatus = this.translate.instant('AUDIT.UPLOAD.STATUS_PREPARING');
      
      setTimeout(() => {
        this.uploadStep = 3;
        this.uploadStatus = this.translate.instant('AUDIT.UPLOAD.STATUS_ROUTING');
        
        setTimeout(() => {
          this.fileSelected.emit(file);
        }, 1500);
      }, 1500);
    }, 1500);
  }
}
