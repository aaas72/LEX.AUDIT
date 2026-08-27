import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

export type SupportedLanguage = 'en' | 'ar' | 'tr';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANG_KEY = 'lex_audit_lang';
  public currentLang = signal<SupportedLanguage>('en');

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.initLanguage();
  }

  private initLanguage(): void {
    let initialLang: SupportedLanguage = 'en';
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem(this.LANG_KEY) as SupportedLanguage;
      const browserLang = this.translate.getBrowserLang() as SupportedLanguage;
      
      if (savedLang && (['en', 'ar', 'tr'] as SupportedLanguage[]).includes(savedLang)) {
        initialLang = savedLang;
      } else if (browserLang && (['en', 'ar', 'tr'] as SupportedLanguage[]).includes(browserLang)) {
        initialLang = browserLang;
      }
    }
    
    this.translate.setFallbackLang('en');
    this.setLanguage(initialLang);
  }

  public setLanguage(lang: SupportedLanguage): void {
    this.currentLang.set(lang);
    this.translate.use(lang);
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.LANG_KEY, lang);
      
      // Update DOM
      const html = this.document.documentElement;
      html.lang = lang;
      html.dir = lang === 'ar' ? 'rtl' : 'ltr';
      if (this.document.body) {
        this.document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
      }
    }
  }
}

