import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideMail,
  lucideLock,
  lucideUser,
  lucideEye,
  lucideEyeOff,
  lucideArrowRight,
  lucideArrowLeft,
  lucideShieldCheck,
  lucideCheckCircle2,
  lucideSparkles,
  lucideKeyRound,
  lucideBuilding2,
  lucideBriefcase,
  lucideCheck,
  lucideAlertTriangle,
  lucideScale,
  lucideCpu,
  lucideFileText,
  lucideFingerprint,
  lucideRefreshCw,
  lucideArrowUpRight
} from '@ng-icons/lucide';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../../shared/components/ui/language-selector/language-selector.component';
import { UiButtonComponent } from '../../shared/components/ui/ui-button/ui-button.component';
import { ContainerComponent } from '../../shared/components/ui/container/container.component';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';

export type AuthMode = 'login' | 'register' | 'forgot';
export type AccountRole = 'LAWYER' | 'ENTERPRISE' | 'INDIVIDUAL';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgIconComponent,
    TranslatePipe,
    LanguageSelectorComponent,
    UiButtonComponent,
    ContainerComponent
  ],
  viewProviders: [
    provideIcons({
      lucideMail,
      lucideLock,
      lucideUser,
      lucideEye,
      lucideEyeOff,
      lucideArrowRight,
      lucideArrowLeft,
      lucideShieldCheck,
      lucideCheckCircle2,
      lucideSparkles,
      lucideKeyRound,
      lucideBuilding2,
      lucideBriefcase,
      lucideCheck,
      lucideAlertTriangle,
      lucideScale,
      lucideCpu,
      lucideFileText,
      lucideFingerprint,
      lucideRefreshCw,
      lucideArrowUpRight
    })
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public langService = inject(LanguageService);
  private translate = inject(TranslateService);
  private authService = inject(AuthService);

  // Active Mode: 'login' | 'register' | 'forgot'
  mode = signal<AuthMode>('login');

  // Password visibility
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);

  // Selected role for registration
  selectedRole = signal<AccountRole>('LAWYER');

  // Login Form
  loginEmail = signal<string>('');
  loginPassword = signal<string>('');
  rememberMe = signal<boolean>(true);

  // Register Form
  registerName = signal<string>('');
  registerEmail = signal<string>('');
  registerPassword = signal<string>('');
  registerConfirmPassword = signal<string>('');
  agreeTerms = signal<boolean>(true);

  // Forgot Password Form
  forgotEmail = signal<string>('');
  forgotOtp = signal<string>('');
  forgotNewPassword = signal<string>('');
  forgotStep = signal<'request' | 'verify'>('request');
  forgotTimer = signal<number>(60);
  private timerInterval: any = null;

  // Interaction State
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  fieldErrors = signal<Record<string, string>>({});

  // Super Footer Rotating Word Phrases
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

  get isRtl(): boolean {
    return this.langService.currentLang() === 'ar';
  }

  onSweepIteration() {
    this.currentWordIndex = (this.currentWordIndex + 1) % this.wordKeys.length;
    this.currentWordKey = this.wordKeys[this.currentWordIndex];
  }

  ngOnInit(): void {
    const currentUrl = this.router.url.toLowerCase();
    if (currentUrl.includes('register') || currentUrl.includes('signup')) {
      this.mode.set('register');
    } else if (currentUrl.includes('forgot') || currentUrl.includes('reset')) {
      this.mode.set('forgot');
    } else {
      this.route.queryParams.subscribe(params => {
        if (params['mode'] === 'register') {
          this.mode.set('register');
        } else if (params['mode'] === 'forgot') {
          this.mode.set('forgot');
        } else {
          this.mode.set('login');
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.clearOtpTimer();
  }

  setMode(newMode: AuthMode): void {
    this.mode.set(newMode);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.fieldErrors.set({});
    this.showPassword.set(false);
    this.showConfirmPassword.set(false);

    const targetPath = newMode === 'login' ? '/login' : newMode === 'register' ? '/register' : '/forgot-password';
    window.history.replaceState({}, '', targetPath);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(v => !v);
  }

  setRole(role: AccountRole): void {
    this.selectedRole.set(role);
  }

  // Quick Demo Accounts Fill
  fillDemo(role: 'lawyer' | 'enterprise'): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    if (role === 'lawyer') {
      this.loginEmail.set('partner@alshammari-law.com');
      this.loginPassword.set('SecureLexAudit#2026');
    } else {
      this.loginEmail.set('legal-ops@aramco-ventures.com');
      this.loginPassword.set('EnterpriseGov#2026');
    }
  }

  // Login Submission
  onLoginSubmit(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.fieldErrors.set({});

    const email = this.loginEmail().trim();
    const password = this.loginPassword().trim();
    const errors: Record<string, string> = {};

    if (!email) {
      errors['loginEmail'] = this.translate.instant('AUTH.ERRORS.EMAIL_REQUIRED');
    }
    if (!password) {
      errors['loginPassword'] = this.translate.instant('AUTH.ERRORS.PASSWORD_REQUIRED');
    }

    if (Object.keys(errors).length > 0) {
      this.fieldErrors.set(errors);
      return;
    }

    this.isLoading.set(true);

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set(
          this.langService.currentLang() === 'ar'
            ? 'تم التحقق من الهوية بنجاح. جارٍ نقلك إلى مساحة العمل...'
            : this.langService.currentLang() === 'tr'
            ? 'Kimlik başarıyla doğrulandı. Çalışma alanına yönlendiriliyorsunuz...'
            : 'Authentication successful. Redirecting to Audit Workspace...'
        );

        setTimeout(() => {
          this.router.navigate(['/audit']);
        }, 1000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.error || 'Authentication failed. Please check your credentials.');
      }
    });
  }

  // Register Submission
  onRegisterSubmit(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.fieldErrors.set({});

    const name = this.registerName().trim();
    const email = this.registerEmail().trim();
    const password = this.registerPassword().trim();
    const confirm = this.registerConfirmPassword().trim();
    const errors: Record<string, string> = {};

    if (!name) {
      errors['registerName'] = this.translate.instant('AUTH.ERRORS.NAME_REQUIRED');
    }
    if (!email) {
      errors['registerEmail'] = this.translate.instant('AUTH.ERRORS.EMAIL_REQUIRED');
    }
    if (!password) {
      errors['registerPassword'] = this.translate.instant('AUTH.ERRORS.PASSWORD_REQUIRED');
    } else if (password.length < 8) {
      errors['registerPassword'] = this.translate.instant('AUTH.ERRORS.PASSWORD_MIN');
    }

    if (!confirm) {
      errors['registerConfirmPassword'] = this.translate.instant('AUTH.ERRORS.PASSWORD_REQUIRED');
    } else if (password !== confirm) {
      errors['registerConfirmPassword'] = this.translate.instant('AUTH.ERRORS.PASSWORD_MISMATCH');
    }

    if (!this.agreeTerms()) {
      errors['agreeTerms'] = this.translate.instant('AUTH.ERRORS.TERMS_REQUIRED');
    }

    if (Object.keys(errors).length > 0) {
      this.fieldErrors.set(errors);
      return;
    }

    this.isLoading.set(true);

    this.authService.register({
      fullName: name,
      email: email,
      password: password
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set(
          this.langService.currentLang() === 'ar'
            ? 'تم إنشاء الحساب بنجاح! جارٍ الدخول...'
            : this.langService.currentLang() === 'tr'
            ? 'Hesap oluşturuldu! Giriş yapılıyor...'
            : 'Account created! Launching...'
        );

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1200);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.error || 'Registration failed. Please try again.');
      }
    });
  }

  // Forgot Password: Step 1 Request
  onForgotRequestSubmit(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.fieldErrors.set({});

    const email = this.forgotEmail().trim();
    const errors: Record<string, string> = {};

    if (!email) {
      errors['forgotEmail'] = this.translate.instant('AUTH.ERRORS.EMAIL_REQUIRED');
      this.fieldErrors.set(errors);
      return;
    }

    this.isLoading.set(true);

    setTimeout(() => {
      this.isLoading.set(false);
      this.forgotStep.set('verify');
      this.forgotOtp.set('849201');
      this.startOtpTimer();
    }, 1000);
  }

  // Forgot Password: Step 2 Verify & Reset
  onForgotVerifySubmit(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.fieldErrors.set({});

    const otp = this.forgotOtp().trim();
    const newPass = this.forgotNewPassword().trim();
    const errors: Record<string, string> = {};

    if (!otp || otp.length < 4) {
      errors['forgotOtp'] = this.translate.instant('AUTH.ERRORS.OTP_REQUIRED');
    }

    if (!newPass || newPass.length < 8) {
      errors['forgotNewPassword'] = this.translate.instant('AUTH.ERRORS.NEW_PASSWORD_REQUIRED');
    }

    if (Object.keys(errors).length > 0) {
      this.fieldErrors.set(errors);
      return;
    }

    this.isLoading.set(true);

    setTimeout(() => {
      this.isLoading.set(false);
      this.clearOtpTimer();
      this.forgotStep.set('request');
      this.setMode('login');
      this.loginEmail.set(this.forgotEmail());
      this.loginPassword.set(this.forgotNewPassword());
      this.successMessage.set(
        this.langService.currentLang() === 'ar'
          ? 'تم تحديث كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.'
          : this.langService.currentLang() === 'tr'
          ? 'Şifreniz başarıyla güncellendi! Artık giriş yapabilirsiniz.'
          : 'Password reset successfully! You can now sign in.'
      );
    }, 1200);
  }

  private startOtpTimer(): void {
    this.clearOtpTimer();
    this.forgotTimer.set(60);
    this.timerInterval = setInterval(() => {
      if (this.forgotTimer() > 0) {
        this.forgotTimer.update(t => t - 1);
      } else {
        this.clearOtpTimer();
      }
    }, 1000);
  }

  private clearOtpTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resendOtp(): void {
    if (this.forgotTimer() > 0) return;
    this.startOtpTimer();
    this.successMessage.set(
      this.langService.currentLang() === 'ar'
        ? 'تمت إعادة إرسال رمز التحقق إلى بريدك الإلكتروني.'
        : this.langService.currentLang() === 'tr'
        ? 'Doğrulama kodu e-postanıza tekrar gönderildi.'
        : 'Verification code has been resent to your email.'
    );
  }
}
