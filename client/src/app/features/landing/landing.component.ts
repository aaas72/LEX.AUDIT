import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../shared/components/ui/ui-button/ui-button.component';
import { UiCardComponent } from '../../shared/components/ui/ui-card/ui-card.component';
import { NavbarComponent } from '../../shared/layouts/navbar/navbar.component';
import { ContainerComponent } from '../../shared/components/ui/container/container.component';
import { FooterComponent } from '../../shared/layouts/footer/footer.component';
import { LandingHeroComponent } from './components/landing-hero/landing-hero.component';
import { FeaturesComponent } from './components/features/features.component';
import { SocialProofComponent } from './components/social-proof/social-proof.component';
import { UseCasesComponent } from './components/use-cases/use-cases.component';
import { CtaComponent } from './components/cta/cta.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiCardComponent, NavbarComponent, FooterComponent, ContainerComponent, LandingHeroComponent, FeaturesComponent, SocialProofComponent, UseCasesComponent, CtaComponent, HowItWorksComponent],
  templateUrl: './landing.component.html',
})
export class LandingComponent {
  steps = [
    { num: '01', title: 'Interpret Unfair Clauses' },
    { num: '02', title: 'Severity Rating' },
    { num: '03', title: 'Exact Excerpt Quotation' },
    { num: '04', title: 'Simple Explanations' },
    { num: '05', title: 'Suggested Alternative Clause Rewrites' }
  ];
}
