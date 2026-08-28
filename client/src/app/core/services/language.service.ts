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
      // 1. Check Cookie first
      const cookieLang = this.getCookie(this.LANG_KEY) as SupportedLanguage;
      // 2. Check localStorage
      const savedLang = localStorage.getItem(this.LANG_KEY) as SupportedLanguage;
      // 3. Detect Browser language
      const detectedLang = this.detectBrowserLanguage();

      if (cookieLang && (['en', 'ar', 'tr'] as SupportedLanguage[]).includes(cookieLang)) {
        initialLang = cookieLang;
      } else if (savedLang && (['en', 'ar', 'tr'] as SupportedLanguage[]).includes(savedLang)) {
        initialLang = savedLang;
      } else if (detectedLang) {
        initialLang = detectedLang;
      }
    }
    
    this.translate.setFallbackLang('en');
    this.setLanguage(initialLang);
  }

  /**
   * Detects the browser's preferred language matching our supported languages (ar, tr, en).
   */
  private detectBrowserLanguage(): SupportedLanguage {
    if (typeof navigator !== 'undefined') {
      const navLangs = navigator.languages || [navigator.language || ''];
      for (const lang of navLangs) {
        if (!lang) continue;
        const lower = lang.toLowerCase();
        if (lower.startsWith('ar')) return 'ar';
        if (lower.startsWith('tr')) return 'tr';
        if (lower.startsWith('en')) return 'en';
      }
    }
    return 'en';
  }

  /**
   * Reads a cookie value by name.
   */
  private getCookie(name: string): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const match = this.document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  /**
   * Sets a persistent cookie with 1-year expiration and SameSite=Lax.
   */
  private setCookie(name: string, value: string, days = 365): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    this.document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }

  public setLanguage(lang: SupportedLanguage): void {
    this.currentLang.set(lang);
    this.translate.use(lang);
    
    if (isPlatformBrowser(this.platformId)) {
      // Store in both Cookie & LocalStorage
      this.setCookie(this.LANG_KEY, lang, 365);
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
