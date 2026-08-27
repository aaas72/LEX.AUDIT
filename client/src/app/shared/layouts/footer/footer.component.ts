import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnimateOnScrollDirective } from '../../directives/animate-on-scroll.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, AnimateOnScrollDirective, TranslatePipe],
  templateUrl: './footer.component.html',
  styles: [`
    /* LTR: Sweeps from LEFT to RIGHT (English, Turkish) */
    @keyframes sweep-ltr {
      0% { background-position: 150% 50%; }
      100% { background-position: -50% 50%; }
    }

    /* RTL: Sweeps from RIGHT to LEFT (Arabic) */
    @keyframes sweep-rtl {
      0% { background-position: -50% 50%; }
      100% { background-position: 150% 50%; }
    }

    .animate-sweep-ltr {
      animation: sweep-ltr 3.5s infinite linear;
    }

    .animate-sweep-rtl {
      animation: sweep-rtl 3.5s infinite linear;
    }
  `]
})
export class FooterComponent {
  public languageService = inject(LanguageService);
  currentYear = new Date().getFullYear();
  
  get isRtl(): boolean {
    return this.languageService.currentLang() === 'ar';
  }

  wordKeys = [
    'FOOTER.WORDS.LEX_AUDIT',
    'FOOTER.WORDS.UNFAIR_CLAUSE',
    'FOOTER.WORDS.HIDDEN_RISK',
    'FOOTER.WORDS.AUTO_RENEWAL',
    'FOOTER.WORDS.LIABILITY_TRAP',
    'FOOTER.WORDS.IP_LEAKAGE'
  ];
  currentWordIndex = 0;
  currentWordKey = this.wordKeys[0];

  onSweepIteration() {
    this.currentWordIndex = (this.currentWordIndex + 1) % this.wordKeys.length;
    this.currentWordKey = this.wordKeys[this.currentWordIndex];
  }
}

