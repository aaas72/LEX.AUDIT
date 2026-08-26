import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideUploadCloud, lucideBrainCircuit, lucideFileCheck2 } from '@ng-icons/lucide';
import { AnimateOnScrollDirective } from '../../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, NgIconComponent, AnimateOnScrollDirective],
  providers: [provideIcons({ lucideUploadCloud, lucideBrainCircuit, lucideFileCheck2 })],
  templateUrl: './how-it-works.component.html'
})
export class HowItWorksComponent {
  steps = [
    {
      title: 'Upload & Configure',
      description: 'Upload your contract securely. Select the opposing party type and set your risk tolerance (Aggressive, Standard, or Lenient).',
      icon: 'lucideUploadCloud'
    },
    {
      title: 'AI Analysis & Rewriting',
      description: 'Our proprietary AI scans the document, flags risky clauses, and automatically suggests balanced, market-standard redlines.',
      icon: 'lucideBrainCircuit'
    },
    {
      title: 'Review & Export',
      description: 'Accept or reject the AI suggestions. Once satisfied, export a clean PDF or a fully tracked Microsoft Word document.',
      icon: 'lucideFileCheck2'
    }
  ];
}
