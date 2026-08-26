import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideAlertTriangle, lucideCheckCircle, lucideDownload, lucideShieldAlert } from '@ng-icons/lucide';

interface ClauseResult {
  title: string;
  description: string;
  status: 'passed' | 'flagged';
  riskLevel?: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-audit-results',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ lucideAlertTriangle, lucideCheckCircle, lucideDownload, lucideShieldAlert })],
  templateUrl: './audit-results.component.html',
  styles: ``
})
export class AuditResultsComponent {
  overallScore = 78;
  
  findings: ClauseResult[] = [
    {
      title: 'Limitation of Liability',
      description: 'The liability cap is set at 50% of the total contract value, which poses a significant risk to the provider.',
      status: 'flagged',
      riskLevel: 'high'
    },
    {
      title: 'Termination for Convenience',
      description: 'Client can terminate at any time with only 15 days notice. Standard is 30 days.',
      status: 'flagged',
      riskLevel: 'medium'
    },
    {
      title: 'Confidentiality Agreement',
      description: 'Standard NDA clauses are present and mutually binding.',
      status: 'passed'
    },
    {
      title: 'Governing Law',
      description: 'Jurisdiction is explicitly set to Delaware, USA.',
      status: 'passed'
    }
  ];
}
