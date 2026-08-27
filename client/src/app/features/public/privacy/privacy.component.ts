import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { NavbarComponent } from '../../../shared/layouts/navbar/navbar.component';
import { FooterComponent } from '../../../shared/layouts/footer/footer.component';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, TranslatePipe, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-black text-brandYellow font-sans flex flex-col justify-between">
      <app-navbar theme="dark"></app-navbar>
      
      <main class="flex-grow pt-24 pb-24 flex flex-col items-center">
        <div class="w-full max-w-4xl px-4 md:px-8">
          <h1 class="text-5xl md:text-7xl font-black tracking-tighter mb-12 border-b-2 border-brandYellow/20 pb-8 uppercase">
            {{ 'PRIVACY_PAGE.TITLE' | translate }}
          </h1>
          
          <div class="space-y-12 text-brandYellowMuted text-lg md:text-xl leading-relaxed">
            <section>
              <h2 class="text-2xl font-bold mb-4 text-brandYellow">{{ 'PRIVACY_PAGE.SEC1_TITLE' | translate }}</h2>
              <p>{{ 'PRIVACY_PAGE.SEC1_DESC' | translate }}</p>
            </section>
            
            <section>
              <h2 class="text-2xl font-bold mb-4 text-brandYellow">{{ 'PRIVACY_PAGE.SEC2_TITLE' | translate }}</h2>
              <p>{{ 'PRIVACY_PAGE.SEC2_DESC' | translate }}</p>
            </section>
            
            <section>
              <h2 class="text-2xl font-bold mb-4 text-brandYellow">{{ 'PRIVACY_PAGE.SEC3_TITLE' | translate }}</h2>
              <p>{{ 'PRIVACY_PAGE.SEC3_DESC' | translate }}</p>
            </section>

            <section>
              <h2 class="text-2xl font-bold mb-4 text-brandYellow">{{ 'PRIVACY_PAGE.SEC4_TITLE' | translate }}</h2>
              <p>{{ 'PRIVACY_PAGE.SEC4_DESC' | translate }}</p>
            </section>
          </div>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `
})
export class PrivacyComponent {}
