import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroDocumentArrowUp } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-upload-zone',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ heroDocumentArrowUp })],
  templateUrl: './upload-zone.component.html',
  styles: ``
})
export class UploadZoneComponent {
  @Output() fileSelected = new EventEmitter<File>();
  isDragging = false;

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
      this.errorMessage = 'Only PDF files are supported for analysis.';
      return;
    }
    
    this.errorMessage = '';
    this.uploadStep = 1;
    this.uploadStatus = 'Verifying file integrity...'; // جاري التحقق من الملف
    
    setTimeout(() => {
      this.uploadStep = 2;
      this.uploadStatus = 'Preparing document for analysis...'; // جاري تجهيز الملف للفحص
      
      setTimeout(() => {
        this.uploadStep = 3;
        this.uploadStatus = 'Routing to processing engine...'; // جاري التوجيه للمعالجة
        
        setTimeout(() => {
          this.fileSelected.emit(file);
        }, 1500);
      }, 1500);
    }, 1500);
  }
}
