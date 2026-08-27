import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideX } from '@ng-icons/lucide';
import { UiButtonComponent } from '../../../../../shared/components/ui/ui-button/ui-button.component';
import { PricingPlan } from '../../pricing.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-pricing-card',
  standalone: true,
  imports: [CommonModule, NgIconComponent, UiButtonComponent, TranslatePipe],
    providers: [provideIcons({ lucideCheck, lucideX })],
  templateUrl: './pricing-card.component.html',
  host: {
    'class': 'h-full block'
  }
})
export class PricingCardComponent {
  @Input({ required: true }) plan!: PricingPlan;
}
