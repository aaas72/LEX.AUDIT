import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideUploadCloud, lucideBrainCircuit, lucideFileCheck2 } from '@ng-icons/lucide';
import { AnimateOnScrollDirective } from '../../../../shared/directives/animate-on-scroll.directive';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, NgIconComponent, AnimateOnScrollDirective, TranslatePipe],
  providers: [provideIcons({ lucideUploadCloud, lucideBrainCircuit, lucideFileCheck2 })],
  templateUrl: './how-it-works.component.html'
})
export class HowItWorksComponent {
  steps = [
    {
      titleKey: 'HOW_IT_WORKS.STEPS.S1_TITLE',
      descKey: 'HOW_IT_WORKS.STEPS.S1_DESC',
      icon: 'lucideUploadCloud'
    },
    {
      titleKey: 'HOW_IT_WORKS.STEPS.S2_TITLE',
      descKey: 'HOW_IT_WORKS.STEPS.S2_DESC',
      icon: 'lucideBrainCircuit'
    },
    {
      titleKey: 'HOW_IT_WORKS.STEPS.S3_TITLE',
      descKey: 'HOW_IT_WORKS.STEPS.S3_DESC',
      icon: 'lucideFileCheck2'
    }
  ];
}
