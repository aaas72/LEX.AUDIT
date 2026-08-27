import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/layouts/navbar/navbar.component';
import { FooterComponent } from '../../../shared/layouts/footer/footer.component';
import { AnimateOnScrollDirective } from '../../../shared/directives/animate-on-scroll.directive';
import { PricingCardComponent } from './components/pricing-card/pricing-card.component';
import { TranslatePipe } from '@ngx-translate/core';

export interface PricingPlan {
  planKey: string;
  isPopular: boolean;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, PricingCardComponent, AnimateOnScrollDirective, TranslatePipe],
  templateUrl: './pricing.component.html'
})
export class PricingComponent {
  plans: PricingPlan[] = [
    { planKey: 'STARTER', isPopular: false },
    { planKey: 'PRO', isPopular: false },
    { planKey: 'AGENCY', isPopular: true },
    { planKey: 'ENTERPRISE', isPopular: false }
  ];
}
