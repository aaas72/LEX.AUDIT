import { Component, Input, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { LanguageService, SupportedLanguage } from '../../../../core/services/language.service';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeName: string;
  shortCode: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      lucideChevronDown
    })
  ],
  template: `
    <div class="relative inline-block text-start select-none z-50" #dropdownRef>
      <!-- Trigger Button -->
      <button
        type="button"
        (click)="toggleDropdown($event)"
        [attr.aria-expanded]="isOpen"
        aria-haspopup="listbox"
        class="relative overflow-hidden group rounded-lg border-2 transition-colors duration-500 flex items-center justify-between gap-2 px-3.5 h-[38px] cursor-pointer text-xs font-bold tracking-widest uppercase focus:outline-none z-0 min-w-[62px]"
        [ngClass]="theme === 'dark' 
          ? (isOpen ? 'border-brandYellow bg-brandYellow text-black' : 'border-brandYellow text-brandYellow bg-transparent hover:border-brandYellow') 
          : (isOpen ? 'border-black bg-black text-brandYellow' : 'border-black text-black bg-transparent hover:border-black')"
      >
        <!-- Inspection Lens Hover Effect -->
        <span 
          *ngIf="!isOpen"
          class="absolute top-1/2 left-1/2 w-0 h-0 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out -z-10 group-hover:w-48 group-hover:h-48"
          [ngClass]="theme === 'dark' ? 'bg-brandYellow' : 'bg-black'"
        ></span>

        <!-- Language Short Code Only (Symbols) -->
        <span 
          class="tracking-widest font-black transition-colors duration-500"
          [ngClass]="theme === 'dark' 
            ? (isOpen ? 'text-black' : 'group-hover:text-black') 
            : (isOpen ? 'text-brandYellow' : 'group-hover:text-brandYellow')"
        >
          {{ currentSelectedLanguage.shortCode }}
        </span>

        <!-- Animated Chevron -->
        <ng-icon 
          name="lucideChevronDown" 
          size="11px" 
          strokeWidth="2.5" 
          class="transition-all duration-300 ease-out"
          [ngClass]="[
            isOpen ? 'rotate-180' : 'rotate-0',
            theme === 'dark' 
              ? (isOpen ? 'text-black' : 'group-hover:text-black') 
              : (isOpen ? 'text-brandYellow' : 'group-hover:text-brandYellow')
          ]"
        ></ng-icon>
      </button>

      <!-- Custom Dropdown Menu (Exact button width) -->
      <div
        *ngIf="isOpen"
        role="listbox"
        class="absolute top-full mt-1.5 start-0 end-0 w-full z-50 rounded-xl border border-brandYellow/30 bg-black p-1 transition-all duration-200 shadow-xl"
        (click)="$event.stopPropagation()"
      >
        <div class="flex flex-col gap-1">
          <button
            *ngFor="let lang of languages"
            type="button"
            role="option"
            [attr.aria-selected]="languageService.currentLang() === lang.code"
            (click)="selectLanguage(lang.code, $event)"
            class="relative overflow-hidden group/item w-full rounded-lg py-1.5 flex items-center justify-center text-xs font-black tracking-widest uppercase cursor-pointer transition-colors duration-300 focus:outline-none"
            [ngClass]="languageService.currentLang() === lang.code 
              ? 'bg-brandYellow text-black font-black' 
              : 'text-brandYellow hover:bg-brandYellow/15 hover:text-brandYellow'"
          >
            <span>{{ lang.shortCode }}</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class LanguageSelectorComponent {
  @Input() theme: 'light' | 'dark' = 'light';

  public languageService = inject(LanguageService);
  private elementRef = inject(ElementRef);

  isOpen = false;

  languages: LanguageOption[] = [
    { code: 'en', label: 'English', nativeName: 'English', shortCode: 'EN' },
    { code: 'ar', label: 'Arabic', nativeName: 'العربية', shortCode: 'AR' },
    { code: 'tr', label: 'Turkish', nativeName: 'Türkçe', shortCode: 'TR' }
  ];

  get currentSelectedLanguage(): LanguageOption {
    const active = this.languageService.currentLang();
    return this.languages.find(l => l.code === active) || this.languages[0];
  }

  toggleDropdown(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.isOpen = !this.isOpen;
  }

  selectLanguage(lang: SupportedLanguage, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.languageService.setLanguage(lang);
    this.isOpen = false;
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
