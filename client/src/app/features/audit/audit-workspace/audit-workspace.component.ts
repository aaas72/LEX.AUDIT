import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UploadZoneComponent } from '../components/upload-zone/upload-zone.component';
import { ScanningProgressComponent } from '../components/scanning-progress/scanning-progress.component';
import { AuditResultsComponent } from '../components/audit-results/audit-results.component';
import { LanguageSelectorComponent } from '../../../shared/components/ui/language-selector/language-selector.component';
import { TranslatePipe } from '@ngx-translate/core';

export type AuditState = 'upload' | 'processing' | 'results';

@Component({
  selector: 'app-audit-workspace',
  standalone: true,
  imports: [CommonModule, RouterModule, UploadZoneComponent, ScanningProgressComponent, AuditResultsComponent, LanguageSelectorComponent, TranslatePipe],
  templateUrl: './audit-workspace.component.html',
  styles: ``
})
export class AuditWorkspaceComponent {
  currentState: AuditState = 'upload';
  uploadedFile: File | null = null;

  onFileUploaded(file: File) {
    this.uploadedFile = file;
    this.currentState = 'processing';
    
    // Simulate AI scanning delay before showing results
    setTimeout(() => {
      this.currentState = 'results';
    }, 10000);
  }
}
