import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditIllustrationComponent } from '../../../../shared/components/audit-illustration/audit-illustration.component';

@Component({
  selector: 'app-scanning-progress',
  standalone: true,
  imports: [CommonModule, AuditIllustrationComponent],
  templateUrl: './scanning-progress.component.html',
  styles: ``
})
export class ScanningProgressComponent {
  @Input() file: File | null = null;
}
