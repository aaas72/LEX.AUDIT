import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../../../../shared/components/ui/container/container.component';
import { AnimateOnScrollDirective } from '../../../../shared/directives/animate-on-scroll.directive';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-social-proof',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective, TranslatePipe],
  templateUrl: './social-proof.component.html',
})
export class SocialProofComponent {
  metrics = [
    { labelKey: 'SOCIAL_PROOF.METRICS.M1_LABEL', valueKey: 'SOCIAL_PROOF.METRICS.M1_VALUE' },
    { labelKey: 'SOCIAL_PROOF.METRICS.M2_LABEL', valueKey: 'SOCIAL_PROOF.METRICS.M2_VALUE' },
    { labelKey: 'SOCIAL_PROOF.METRICS.M3_LABEL', valueKey: 'SOCIAL_PROOF.METRICS.M3_VALUE' }
  ];
}
