import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideScale, lucideLandmark, lucideLaptop } from '@ng-icons/lucide';
import { AnimateOnScrollDirective } from '../../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-use-cases',
  standalone: true,
  imports: [CommonModule, NgIconComponent, AnimateOnScrollDirective],
  viewProviders: [provideIcons({ lucideScale, lucideLandmark, lucideLaptop })],
  templateUrl: './use-cases.component.html',
})
export class UseCasesComponent {
  cases = [
    {
      title: 'Law Firms',
      description: 'Accelerate contract review cycles. Let our AI do the heavy lifting of initial risk detection so your attorneys can focus on strategic negotiations.',
      icon: 'lucideScale'
    },
    {
      title: 'Freelancers & Contractors',
      description: 'Don\'t sign away your rights. Instantly understand complex legal jargon and ensure your client contracts are fair and balanced before you begin work.',
      icon: 'lucideLaptop'
    },
    {
      title: 'Enterprise Legal Ops',
      description: 'Standardize risk assessment across thousands of vendor agreements. Ensure corporate compliance without slowing down the procurement process.',
      icon: 'lucideLandmark'
    }
  ];
}
