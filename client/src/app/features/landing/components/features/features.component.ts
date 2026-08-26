import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideAlertCircle, lucideEdit2 } from '@ng-icons/lucide';
import { ContainerComponent } from '../../../../shared/components/ui/container/container.component';
import { AnimateOnScrollDirective } from '../../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, NgIconComponent, ContainerComponent, AnimateOnScrollDirective],
  viewProviders: [provideIcons({ lucideSearch, lucideAlertCircle, lucideEdit2 })],
  templateUrl: './features.component.html',
})
export class FeaturesComponent {
  features = [
    {
      title: 'Smart Clause Detection',
      description: 'Our AI engine instantly scans hundreds of pages to identify hidden, unfair, or highly irregular clauses that manual auditing might miss.',
      icon: 'lucideSearch'
    },
    {
      title: 'Severity Risk Rating',
      description: 'Every detected issue is categorized by risk severity, allowing legal teams and individuals to prioritize critical contract negotiations.',
      icon: 'lucideAlertCircle'
    },
    {
      title: 'Alternative Rewriting',
      description: 'LEX.AUDIT doesn’t just point out problems; it suggests balanced, fair, and legally sound alternative phrasing for risky clauses.',
      icon: 'lucideEdit2'
    }
  ];
}
