import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../../../shared/components/ui/ui-button/ui-button.component';
import { AnimateOnScrollDirective } from '../../../../shared/directives/animate-on-scroll.directive';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, AnimateOnScrollDirective, TranslatePipe],
  templateUrl: './cta.component.html',
})
export class CtaComponent {}
