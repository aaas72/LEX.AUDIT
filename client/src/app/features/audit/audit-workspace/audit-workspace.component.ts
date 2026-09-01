import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UploadZoneComponent } from '../components/upload-zone/upload-zone.component';
import { ScanningProgressComponent } from '../components/scanning-progress/scanning-progress.component';
import { AuditResultsComponent } from '../components/audit-results/audit-results.component';
import { LanguageSelectorComponent } from '../../../shared/components/ui/language-selector/language-selector.component';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { ContractService } from '../../../core/services/contract.service';
import { UserService } from '../../../core/services/user.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideArrowRight } from '@ng-icons/lucide';

export type AuditState = 'upload' | 'processing' | 'results';

@Component({
  selector: 'app-audit-workspace',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    UploadZoneComponent, 
    ScanningProgressComponent, 
    AuditResultsComponent, 
    LanguageSelectorComponent, 
    TranslatePipe,
    NgIconComponent
  ],
  providers: [
    provideIcons({ lucideArrowLeft, lucideArrowRight })
  ],
  templateUrl: './audit-workspace.component.html',
  styles: ``
})
export class AuditWorkspaceComponent {
  public langService = inject(LanguageService);
  private contractService = inject(ContractService);
  private userService = inject(UserService);

  currentState: AuditState = 'upload';
  uploadedFile: File | null = null;
  errorMessage = '';

  onFileUploaded(file: File) {
    this.uploadedFile = file;
    this.currentState = 'processing';
    this.errorMessage = '';
    
    // First verify the API Key is active
    this.userService.verifyApiKey().subscribe({
      next: (res) => {
        if (!res.isValid) {
          this.currentState = 'upload';
          this.errorMessage = 'Your Gemini API Key is missing or invalid. Please update it in Settings.';
          return;
        }
        
        // Key is valid, proceed with upload
        this.processUpload(file);
      },
      error: () => {
        this.currentState = 'upload';
        this.errorMessage = 'Failed to verify API Key. Please try again.';
      }
    });
  }

  private processUpload(file: File) {
    // UserRole mapping should be implemented properly based on UI selection. Using 0 (FirstParty) for now.
    this.contractService.uploadContract(file, 1).subscribe({
      next: (response) => {
        // The backend triggers SignalR events to track progress, but for now we'll simulate moving to results.
        setTimeout(() => {
          this.currentState = 'results';
        }, 3000);
      },
      error: (err) => {
        console.error('Upload Error Details:', err); // Log the full error to console
        this.currentState = 'upload';
        
        if (err.error && err.error.errors) {
          // ASP.NET Core Validation Problem Details
          const firstKey = Object.keys(err.error.errors)[0];
          this.errorMessage = err.error.errors[firstKey][0];
        } else if (err.error && err.error.error) {
          // Specific reason provided by backend (e.g. AI extraction failed)
          this.errorMessage = err.error.error;
        } else if (err.error && err.error.title) {
          this.errorMessage = err.error.title;
        } else if (err.status === 0) {
          this.errorMessage = 'AUDIT.UPLOAD.ERROR_NETWORK';
        } else if (err.status === 500) {
          this.errorMessage = 'AUDIT.UPLOAD.ERROR_SERVER';
        } else {
          this.errorMessage = 'AUDIT.UPLOAD.ERROR_GENERIC';
        }
      }
    });
  }
}