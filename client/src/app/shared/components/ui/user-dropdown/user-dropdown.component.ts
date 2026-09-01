import { Component, Input, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideUser, lucideLogOut, lucideSettings, lucideFileText, lucideBookOpen } from '@ng-icons/lucide';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, TranslateDirective, NgIconComponent],
  providers: [
    provideIcons({
      lucideUser,
      lucideLogOut,
      lucideSettings,
      lucideFileText,
      lucideBookOpen
    })
  ],
  template: `
    <div class="relative inline-block text-start select-none z-50" #dropdownRef>
      <!-- Trigger Button -->
      <button
        type="button"
        (click)="toggleDropdown($event)"
        [attr.aria-expanded]="isOpen"
        class="group relative z-0 flex items-center justify-center w-12 h-12 rounded-full border cursor-pointer focus:outline-none overflow-hidden transition-colors duration-700"
        [ngClass]="theme === 'dark' ? 'border-brandYellow/30' : 'border-black/30'"
      >
        <!-- Lens -->
        <span class="absolute top-1/2 ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-full transition-all duration-700 ease-out group-hover:w-[150px] group-hover:h-[150px] -z-10"
              [ngClass]="theme === 'dark' ? 'bg-brandYellow' : 'bg-black'"></span>
        
        <!-- Icon -->
        <ng-icon name="lucideUser" size="20" class="transition-colors duration-700"
                 [ngClass]="theme === 'dark' ? 'text-brandYellow group-hover:text-black' : 'text-black group-hover:text-brandYellow'"></ng-icon>
      </button>

      <!-- Dropdown Menu -->
      <div
        *ngIf="isOpen"
        class="absolute top-full mt-3 w-64 z-50 rounded-xl border p-2 overflow-hidden bg-black end-0"
        [ngClass]="theme === 'dark' ? 'border-white/10' : 'border-brandYellow/30'"
        (click)="$event.stopPropagation()"
      >
        <div class="flex flex-col gap-1">
          <!-- Item: Settings -->
          <a
            routerLink="/settings"
            (click)="closeDropdown()"
            class="group relative z-0 flex items-center gap-3 px-3 py-2 rounded-lg font-black text-sm tracking-tight overflow-hidden cursor-pointer"
          >
            <!-- Lens -->
            <span class="absolute top-1/2 -translate-y-1/2 w-0 h-0 rounded-full transition-all duration-700 ease-out group-hover:w-[400px] group-hover:h-[400px] -z-10 ltr:left-[28px] ltr:-translate-x-1/2 rtl:right-[28px] rtl:translate-x-1/2 bg-brandYellow"></span>
            
            <!-- Icon with circular border -->
            <div class="flex items-center justify-center w-8 h-8 shrink-0 rounded-full border transition-colors duration-700 border-white/10 group-hover:border-black">
              <ng-icon name="lucideSettings" size="16" class="transition-colors duration-700 text-brandYellow group-hover:text-black"></ng-icon>
            </div>

            <!-- Text -->
            <span class="transition-colors duration-700 text-brandYellow group-hover:text-black">
              {{ 'USER_MENU.SETTINGS' | translate }}
            </span>
          </a>
          
          <!-- Item: Audit Page -->
          <a
            routerLink="/audit"
            (click)="closeDropdown()"
            class="group relative z-0 flex items-center gap-3 px-3 py-2 rounded-lg font-black text-sm tracking-tight overflow-hidden cursor-pointer"
          >
            <span class="absolute top-1/2 -translate-y-1/2 w-0 h-0 rounded-full transition-all duration-700 ease-out group-hover:w-[400px] group-hover:h-[400px] -z-10 ltr:left-[28px] ltr:-translate-x-1/2 rtl:right-[28px] rtl:translate-x-1/2 bg-brandYellow"></span>
            
            <div class="flex items-center justify-center w-8 h-8 shrink-0 rounded-full border transition-colors duration-700 border-white/10 group-hover:border-black">
              <ng-icon name="lucideFileText" size="16" class="transition-colors duration-700 text-brandYellow group-hover:text-black"></ng-icon>
            </div>

            <span class="transition-colors duration-700 text-brandYellow group-hover:text-black">
              {{ 'USER_MENU.AUDIT_PAGE' | translate }}
            </span>
          </a>

          <!-- Item: Contracts -->
          <a
            routerLink="/contracts"
            (click)="closeDropdown()"
            class="group relative z-0 flex items-center gap-3 px-3 py-2 rounded-lg font-black text-sm tracking-tight overflow-hidden cursor-pointer"
          >
            <span class="absolute top-1/2 -translate-y-1/2 w-0 h-0 rounded-full transition-all duration-700 ease-out group-hover:w-[400px] group-hover:h-[400px] -z-10 ltr:left-[28px] ltr:-translate-x-1/2 rtl:right-[28px] rtl:translate-x-1/2 bg-brandYellow"></span>
            
            <div class="flex items-center justify-center w-8 h-8 shrink-0 rounded-full border transition-colors duration-700 border-white/10 group-hover:border-black">
              <ng-icon name="lucideBookOpen" size="16" class="transition-colors duration-700 text-brandYellow group-hover:text-black"></ng-icon>
            </div>

            <span class="transition-colors duration-700 text-brandYellow group-hover:text-black">
              {{ 'USER_MENU.CONTRACTS' | translate }}
            </span>
          </a>

          <!-- Separator -->
          <div class="h-px w-full my-1 bg-white/10"></div>

          <!-- Item: Logout -->
          <button
            (click)="logout()"
            class="group relative z-0 flex items-center gap-3 px-3 py-2 rounded-lg font-black text-sm tracking-tight w-full text-start overflow-hidden cursor-pointer"
          >
            <!-- Red Lens for logout -->
            <span class="absolute top-1/2 -translate-y-1/2 w-0 h-0 rounded-full transition-all duration-700 ease-out group-hover:w-[400px] group-hover:h-[400px] -z-10 ltr:left-[28px] ltr:-translate-x-1/2 rtl:right-[28px] rtl:translate-x-1/2 bg-red-500"></span>
            
            <div class="flex items-center justify-center w-8 h-8 shrink-0 rounded-full border transition-colors duration-700 border-red-500/30 group-hover:border-white">
              <ng-icon name="lucideLogOut" size="16" class="transition-colors duration-700 text-red-500 group-hover:text-white"></ng-icon>
            </div>

            <span class="transition-colors duration-700 text-red-500 group-hover:text-white">
              {{ 'USER_MENU.LOGOUT' | translate }}
            </span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class UserDropdownComponent {
  @Input() theme: 'light' | 'dark' = 'light';

  public authService = inject(AuthService);
  private elementRef = inject(ElementRef);

  isOpen = false;

  toggleDropdown(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  logout() {
    this.closeDropdown();
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    if (this.isOpen) {
      this.isOpen = false;
    }
  }
}
