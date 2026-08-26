import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../../../../shared/components/ui/container/container.component';
import { AnimateOnScrollDirective } from '../../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-social-proof',
  standalone: true,
  imports: [CommonModule, ContainerComponent, AnimateOnScrollDirective],
  templateUrl: './social-proof.component.html',
})
export class SocialProofComponent {
  metrics = [
    { label: 'Contracts Audited', value: '10,000+' },
    { label: 'Hidden Risks Detected', value: '2.5M+' },
    { label: 'Average Time Saved', value: '85%' }
  ];
}
