import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/layouts/navbar/navbar.component';
import { FooterComponent } from '../../../shared/layouts/footer/footer.component';
import { UiButtonComponent } from '../../../shared/components/ui/ui-button/ui-button.component';
import { AnimateOnScrollDirective } from '../../../shared/directives/animate-on-scroll.directive';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideBrain, lucideFileText, lucideShieldCheck, lucideUsers, lucideSettings, lucideZap } from '@ng-icons/lucide';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, UiButtonComponent, AnimateOnScrollDirective, NgIconComponent],
  providers: [provideIcons({ lucideBrain, lucideFileText, lucideShieldCheck, lucideUsers, lucideSettings, lucideZap })],
  templateUrl: './features.component.html'
})
export class FeaturesComponent {
  features = [
    {
      title: 'AI-Powered Risk Detection',
      description: 'Our proprietary models scan contracts instantly to identify hidden clauses, skewed liabilities, and regulatory risks.',
      icon: 'lucideBrain'
    },
    {
      title: 'Automated Clause Rewriting',
      description: 'Don’t just find the problem. Let our AI suggest fairer, balanced alternatives based on standard legal precedents.',
      icon: 'lucideFileText'
    },
    {
      title: 'Compliance & Governance',
      description: 'Ensure every contract adheres to your internal playbooks and external compliance standards automatically.',
      icon: 'lucideShieldCheck'
    },
    {
      title: 'Real-time Collaboration',
      description: 'Work seamlessly with your legal and sales teams. Leave comments, approve changes, and track version history in one place.',
      icon: 'lucideUsers'
    },
    {
      title: 'Custom Playbook Integration',
      description: 'Train our AI on your specific company playbooks to ensure audits are tailored precisely to your risk tolerance.',
      icon: 'lucideSettings'
    },
    {
      title: 'Instant Execution',
      description: 'Turn weeks of manual review into minutes. Accelerate your deal cycles and close contracts faster than ever before.',
      icon: 'lucideZap'
    }
  ];
}
