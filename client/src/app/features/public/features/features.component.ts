import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/layouts/navbar/navbar.component';
import { FooterComponent } from '../../../shared/layouts/footer/footer.component';
import { UiButtonComponent } from '../../../shared/components/ui/ui-button/ui-button.component';
import { AnimateOnScrollDirective } from '../../../shared/directives/animate-on-scroll.directive';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideBrain, lucideFileText, lucideShieldCheck, lucideUsers, lucideSettings, lucideZap } from '@ng-icons/lucide';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, UiButtonComponent, AnimateOnScrollDirective, NgIconComponent, TranslatePipe],
  providers: [provideIcons({ lucideBrain, lucideFileText, lucideShieldCheck, lucideUsers, lucideSettings, lucideZap })],
  templateUrl: './features.component.html'
})
export class FeaturesComponent {
  features = [
    {
      titleKey: 'FEATURES_PAGE.CARDS.F1_TITLE',
      descKey: 'FEATURES_PAGE.CARDS.F1_DESC',
      icon: 'lucideBrain'
    },
    {
      titleKey: 'FEATURES_PAGE.CARDS.F2_TITLE',
      descKey: 'FEATURES_PAGE.CARDS.F2_DESC',
      icon: 'lucideFileText'
    },
    {
      titleKey: 'FEATURES_PAGE.CARDS.F3_TITLE',
      descKey: 'FEATURES_PAGE.CARDS.F3_DESC',
      icon: 'lucideShieldCheck'
    },
    {
      titleKey: 'FEATURES_PAGE.CARDS.F4_TITLE',
      descKey: 'FEATURES_PAGE.CARDS.F4_DESC',
      icon: 'lucideUsers'
    },
    {
      titleKey: 'FEATURES_PAGE.CARDS.F5_TITLE',
      descKey: 'FEATURES_PAGE.CARDS.F5_DESC',
      icon: 'lucideSettings'
    },
    {
      titleKey: 'FEATURES_PAGE.CARDS.F6_TITLE',
      descKey: 'FEATURES_PAGE.CARDS.F6_DESC',
      icon: 'lucideZap'
    }
  ];
}
