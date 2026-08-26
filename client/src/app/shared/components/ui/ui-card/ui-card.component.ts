import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="['border border-white/40 bg-white/10 backdrop-blur-sm p-6', customClass]">
      <div *ngIf="title" class="border-b border-white/30 pb-3 mb-4 text-center">
        <h3 class="text-sm font-bold uppercase tracking-widest text-white/90">{{ title }}</h3>
      </div>
      <ng-content></ng-content>
    </div>
  `
})
export class UiCardComponent {
  @Input() title?: string;
  @Input() customClass = '';
}
