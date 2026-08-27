import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../../components/ui/language-selector/language-selector.component';
import { UiButtonComponent } from '../../components/ui/ui-button/ui-button.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, LanguageSelectorComponent, UiButtonComponent],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent {
  @Input() theme: 'light' | 'dark' = 'light';
}
