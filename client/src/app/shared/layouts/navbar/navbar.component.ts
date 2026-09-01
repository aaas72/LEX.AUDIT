import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../../components/ui/language-selector/language-selector.component';
import { UserDropdownComponent } from '../../components/ui/user-dropdown/user-dropdown.component';
import { UiButtonComponent } from '../../components/ui/ui-button/ui-button.component';
import { AuthService } from '../../../core/services/auth.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideUser, lucideLogOut } from '@ng-icons/lucide';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, LanguageSelectorComponent, UserDropdownComponent, UiButtonComponent, NgIconComponent],
  viewProviders: [
    provideIcons({
      lucideUser,
      lucideLogOut
    })
  ],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent {
  @Input() theme: 'light' | 'dark' = 'light';
  public authService = inject(AuthService);
  public router = inject(Router);
}
