import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideShieldAlert, lucideFileText } from '@ng-icons/lucide';
import { PdfExportService } from '../../../../core/services/pdf-export.service';

@Component({
  selector: 'app-audit-results',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ lucideDownload, lucideShieldAlert, lucideFileText })],
  templateUrl: './audit-results.component.html',
  styles: ``
})
export class AuditResultsComponent {
  private pdfExportService = inject(PdfExportService);

  overallScore = 78;
  riskClassification = 'HIGH RISK';
  totalClauses = 85;
  flaggedIssues = 14;

  exportPdf() {
    this.pdfExportService.exportAuditReport({
      documentName: 'Master_Cloud_Services_Agreement.pdf',
      date: new Date().toLocaleDateString(),
      overallScore: this.overallScore,
      riskClassification: this.riskClassification,
      totalClauses: this.totalClauses,
      flaggedIssues: this.flaggedIssues,
      findings: [
        {
          title: 'Limitation of Liability',
          description: 'The liability cap is set at 50% of the total contract value, posing a significant risk to the provider.',
          status: 'flagged',
          riskLevel: 'high',
          recommendation: 'Amend cap to 100% of the trailing 12-month fees.'
        },
        {
          title: 'Termination for Convenience',
          description: 'Client can terminate at any time with only 15 days notice. Standard is 30 days.',
          status: 'flagged',
          riskLevel: 'medium',
          recommendation: 'Extend notice period to a minimum of 30 days.'
        },
        {
          title: 'Data Monetization',
          description: 'Provider retains the right to sell anonymized data without explicit consent.',
          status: 'flagged',
          riskLevel: 'high',
          recommendation: 'Require explicit written opt-in from Customer before data monetization.'
        }
      ]
    });
  }
}
