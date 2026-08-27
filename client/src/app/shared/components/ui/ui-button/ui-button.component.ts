import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <button 
      [type]="type"
      [disabled]="disabled"
      (click)="handleClick($event)"
      class="relative overflow-hidden group bg-transparent border-2 transition-colors duration-500 z-0 disabled:opacity-50 disabled:pointer-events-none cursor-pointer inline-flex items-center justify-center"
      [ngClass]="[
        variant === 'dark' ? 'border-black text-black' : 'border-brandYellow text-brandYellow',
        fullWidth ? 'w-full' : '',
        rounded === 'none' ? 'rounded-none' : rounded === 'sm' ? 'rounded-sm' : rounded === 'md' ? 'rounded-md' : rounded === 'full' ? 'rounded-full' : 'rounded-lg',
        size === 'sm' ? 'h-[38px] px-5 text-xs font-bold tracking-widest uppercase' :
        size === 'md' ? 'h-[46px] px-8 text-base font-bold tracking-wide' : 
        'h-[52px] px-8 text-center text-sm font-bold tracking-widest uppercase'
      ]">
      
      <!-- Inspection Lens Expanding Circle -->
      <span class="absolute top-1/2 left-1/2 w-0 h-0 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out -z-10 group-hover:w-[800px] group-hover:h-[800px]"
            [ngClass]="variant === 'dark' ? 'bg-black' : 'bg-brandYellow'"></span>
      
      <!-- Text & Content Inversion -->
      <span class="relative z-10 flex items-center justify-center gap-2 transition-colors duration-500"
            [ngClass]="variant === 'dark' ? 'group-hover:text-brandYellow' : 'group-hover:text-black'">
        {{ text }}
        <ng-content></ng-content>
      </span>
    </button>
  `
})
export class UiButtonComponent {
  private router = inject(Router);

  @Input({ required: true }) text!: string;
  @Input() variant: 'dark' | 'yellow' = 'dark';
  @Input() fullWidth: boolean = false;
  @Input() rounded: 'none' | 'sm' | 'md' | 'lg' | 'full' = 'lg';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled: boolean = false;
  @Input() routerLink?: string | any[];

  @Output() btnClick = new EventEmitter<MouseEvent>();

  handleClick(event: MouseEvent): void {
    if (this.disabled) return;
    this.btnClick.emit(event);
    if (this.routerLink) {
      if (typeof this.routerLink === 'string') {
        this.router.navigate([this.routerLink]);
      } else {
        this.router.navigate(this.routerLink);
      }
    }
  }
}
