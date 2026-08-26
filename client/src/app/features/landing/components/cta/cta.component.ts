import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../../../shared/components/ui/ui-button/ui-button.component';
import { AnimateOnScrollDirective } from '../../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, AnimateOnScrollDirective],
  templateUrl: './cta.component.html',
})
export class CtaComponent {}
