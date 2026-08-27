import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../../shared/components/ui/ui-button/ui-button.component';
import { NavbarComponent } from '../../../shared/layouts/navbar/navbar.component';
import { FooterComponent } from '../../../shared/layouts/footer/footer.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, NavbarComponent, FooterComponent, TranslatePipe],
  templateUrl: './contact.component.html',
})
export class ContactComponent {}
