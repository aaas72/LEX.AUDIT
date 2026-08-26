import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/layouts/navbar/navbar.component';
import { FooterComponent } from '../../../shared/layouts/footer/footer.component';
import { AnimateOnScrollDirective } from '../../../shared/directives/animate-on-scroll.directive';
import { PricingCardComponent } from './components/pricing-card/pricing-card.component';

export interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description: string;
  pros: string[];
  cons: string[];
  isPopular: boolean;
  buttonText: string;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, PricingCardComponent, AnimateOnScrollDirective],
  templateUrl: './pricing.component.html'
})
export class PricingComponent {
  plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'For individuals exploring AI legal audits.',
      pros: [
        '3 contract audits per month',
        'Basic AI risk detection',
        'Standard PDF reports'
      ],
      cons: [
        'No clause rewriting',
        'No custom templates',
        'No team features'
      ],
      isPopular: false,
      buttonText: 'Get Started'
    },
    {
      name: 'Professional',
      price: '$49',
      period: '/mo',
      description: 'For solo lawyers handling steady volumes.',
      pros: [
        '50 contract audits per month',
        'Advanced AI logic',
        'Priority email support',
        'Word & PDF exports'
      ],
      cons: [
        'No clause rewriting',
        'Single user only'
      ],
      isPopular: false,
      buttonText: 'Start Trial'
    },
    {
      name: 'Agency',
      price: '$149',
      period: '/mo',
      description: 'Ideal for small firms and growing legal teams.',
      pros: [
        'Unlimited contract audits',
        'AI clause rewriting',
        'Team collaboration (up to 5)',
        'Custom templates integration'
      ],
      cons: [
        'No dedicated account manager',
        'No on-premise deployment'
      ],
      isPopular: true,
      buttonText: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Built for corporate legal ops demanding full control.',
      pros: [
        'Everything in Agency',
        'Unlimited team members',
        'Dedicated account manager',
        'On-premise deployment',
        'Custom API access'
      ],
      cons: [
        'Requires custom onboarding'
      ],
      isPopular: false,
      buttonText: 'Contact Sales'
    }
  ];
}
