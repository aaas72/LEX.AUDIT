import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <button class="relative overflow-hidden group bg-transparent border-2 transition-colors duration-500 z-0"
            [ngClass]="[
              variant === 'dark' ? 'border-black text-black' : 'border-brandYellow text-brandYellow',
              fullWidth ? 'w-full' : '',
              rounded === 'none' ? 'rounded-none' : rounded === 'sm' ? 'rounded-sm' : rounded === 'md' ? 'rounded-md' : rounded === 'full' ? 'rounded-full' : 'rounded-lg',
              size === 'md' ? 'px-8 py-3 text-base font-bold tracking-wide' : 'px-8 py-4 text-center text-sm font-bold tracking-widest uppercase'
            ]">
      <span class="absolute top-1/2 left-1/2 w-0 h-0 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out -z-10 group-hover:w-[800px] group-hover:h-[800px]"
            [ngClass]="variant === 'dark' ? 'bg-black' : 'bg-brandYellow'"></span>
      <span class="relative z-10 flex items-center justify-center gap-2 transition-colors duration-500"
            [ngClass]="variant === 'dark' ? 'group-hover:text-brandYellow' : 'group-hover:text-black'">
        {{ text }}
      </span>
    </button>
  `
})
export class UiButtonComponent {
  @Input({ required: true }) text!: string;
  @Input() variant: 'dark' | 'yellow' = 'dark';
  @Input() fullWidth: boolean = false;
  @Input() rounded: 'none' | 'sm' | 'md' | 'lg' | 'full' = 'lg';
  @Input() size: 'md' | 'lg' = 'md';
}
