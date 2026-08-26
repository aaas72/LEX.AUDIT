import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditIllustrationComponent } from '../../../../shared/components/audit-illustration/audit-illustration.component';
import { UiButtonComponent } from '../../../../shared/components/ui/ui-button/ui-button.component';
import { AnimateOnScrollDirective } from '../../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-landing-hero',
  standalone: true,
  imports: [CommonModule, AuditIllustrationComponent, UiButtonComponent, AnimateOnScrollDirective],
  templateUrl: './landing-hero.component.html',
})
export class LandingHeroComponent {
}
