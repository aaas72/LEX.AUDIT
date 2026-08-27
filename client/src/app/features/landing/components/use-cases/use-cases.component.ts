import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideScale, lucideLandmark, lucideLaptop } from '@ng-icons/lucide';
import { AnimateOnScrollDirective } from '../../../../shared/directives/animate-on-scroll.directive';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-use-cases',
  standalone: true,
  imports: [CommonModule, NgIconComponent, AnimateOnScrollDirective, TranslatePipe],
  viewProviders: [provideIcons({ lucideScale, lucideLandmark, lucideLaptop })],
  templateUrl: './use-cases.component.html',
})
export class UseCasesComponent {
  cases = [
    {
      titleKey: 'USE_CASES.CASES.C1_TITLE',
      descKey: 'USE_CASES.CASES.C1_DESC',
      icon: 'lucideScale'
    },
    {
      titleKey: 'USE_CASES.CASES.C2_TITLE',
      descKey: 'USE_CASES.CASES.C2_DESC',
      icon: 'lucideLaptop'
    },
    {
      titleKey: 'USE_CASES.CASES.C3_TITLE',
      descKey: 'USE_CASES.CASES.C3_DESC',
      icon: 'lucideLandmark'
    }
  ];
}
