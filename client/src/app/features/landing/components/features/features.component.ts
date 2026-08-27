import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideAlertCircle, lucideEdit2 } from '@ng-icons/lucide';
import { ContainerComponent } from '../../../../shared/components/ui/container/container.component';
import { AnimateOnScrollDirective } from '../../../../shared/directives/animate-on-scroll.directive';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, NgIconComponent, ContainerComponent, AnimateOnScrollDirective, TranslatePipe],
  viewProviders: [provideIcons({ lucideSearch, lucideAlertCircle, lucideEdit2 })],
  templateUrl: './features.component.html',
})
export class FeaturesComponent {
  features = [
    {
      titleKey: 'FEATURES.CARDS.F1_TITLE',
      descKey: 'FEATURES.CARDS.F1_DESC',
      icon: 'lucideSearch'
    },
    {
      titleKey: 'FEATURES.CARDS.F2_TITLE',
      descKey: 'FEATURES.CARDS.F2_DESC',
      icon: 'lucideAlertCircle'
    },
    {
      titleKey: 'FEATURES.CARDS.F3_TITLE',
      descKey: 'FEATURES.CARDS.F3_DESC',
      icon: 'lucideEdit2'
    }
  ];
}
