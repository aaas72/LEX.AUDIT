import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditIllustrationComponent } from '../../../../shared/components/audit-illustration/audit-illustration.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-scanning-progress',
  standalone: true,
  imports: [CommonModule, AuditIllustrationComponent, TranslatePipe],
  templateUrl: './scanning-progress.component.html',
  styles: ``
})
export class ScanningProgressComponent implements OnInit, OnDestroy {
  @Input() file: File | null = null;

  spotlightX = 0;
  private animationId?: number;
  private time = 0;

  ngOnInit() {
    this.animateSpotlight();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private animateSpotlight() {
    const loop = () => {
      this.time += 0.5;
      // Linear sweep: 0% → 100%, then restart from 0%
      this.spotlightX = this.time % 100;
      this.animationId = requestAnimationFrame(loop);
    };
    this.animationId = requestAnimationFrame(loop);
  }
}
