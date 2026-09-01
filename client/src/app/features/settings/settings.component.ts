import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideUser, lucideMail, lucideCreditCard, lucideActivity, lucideLock, lucideCheck, lucideX, lucideKey } from '@ng-icons/lucide';
import { LanguageSelectorComponent } from '../../shared/components/ui/language-selector/language-selector.component';
import { UiButtonComponent } from '../../shared/components/ui/ui-button/ui-button.component';
import { NavbarComponent } from '../../shared/layouts/navbar/navbar.component';
import { UserService } from '../../core/services/user.service';
import { UserProfile } from '../../core/models/user.models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, TranslatePipe, NgIconComponent, LanguageSelectorComponent, ReactiveFormsModule, NavbarComponent, UiButtonComponent],
  providers: [provideIcons({ lucideUser, lucideMail, lucideCreditCard, lucideActivity, lucideLock, lucideCheck, lucideX, lucideKey })],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  
  profile$ = new BehaviorSubject<UserProfile | null>(null);

  profileForm: FormGroup;
  passwordForm: FormGroup;
  
  profileSuccess = false;
  profileError = '';
  
  passwordSuccess = false;
  passwordError = '';
  
  apiKeyForm: FormGroup;
  apiKeySuccess = false;
  apiKeyError = '';
  isVerifyingKey = false;
  
  constructor() {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]]
    });
    
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
    
    this.apiKeyForm = this.fb.group({
      apiKey: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getMyProfile().subscribe({
      next: (profile) => {
        this.profile$.next(profile);
        this.profileForm.patchValue({
          fullName: profile.fullName
        });
      },
      error: (err) => console.error(err)
    });
  }
  
  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  updateProfile() {
    if (this.profileForm.invalid) return;
    
    this.profileSuccess = false;
    this.profileError = '';
    
    this.userService.updateProfile({ fullName: this.profileForm.value.fullName }).subscribe({
      next: (updatedProfile) => {
        this.profile$.next(updatedProfile);
        this.profileSuccess = true;
        setTimeout(() => this.profileSuccess = false, 3000);
      },
      error: (err) => {
        this.profileError = err.error?.message || 'Failed to update profile.';
      }
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) return;
    
    this.passwordSuccess = false;
    this.passwordError = '';
    
    const { currentPassword, newPassword } = this.passwordForm.value;
    
    this.userService.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.passwordSuccess = true;
        this.passwordForm.reset();
        setTimeout(() => this.passwordSuccess = false, 3000);
      },
      error: (err) => {
        this.passwordError = err.error?.error || 'Failed to change password.';
      }
    });
  }

  updateApiKey() {
    if (this.apiKeyForm.invalid) return;
    
    this.apiKeySuccess = false;
    this.apiKeyError = '';
    this.isVerifyingKey = true;
    
    const apiKey = this.apiKeyForm.value.apiKey;
    
    this.userService.updateApiKey(apiKey).subscribe({
      next: () => {
        this.apiKeySuccess = true;
        this.isVerifyingKey = false;
        
        // Update local profile state so the UI knows they have a key
        const currentProfile = this.profile$.value;
        if (currentProfile) {
          this.profile$.next({ ...currentProfile, hasApiKey: true });
        }
        
        this.apiKeyForm.reset();
        setTimeout(() => this.apiKeySuccess = false, 3000);
      },
      error: (err) => {
        this.isVerifyingKey = false;
        this.apiKeyError = err.error?.error || 'Failed to validate or save API key.';
      }
    });
  }
}
