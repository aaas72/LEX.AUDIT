import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAnimateOnScroll]',
  standalone: true
})
export class AnimateOnScrollDirective implements OnInit, OnDestroy {
  @Input('appAnimateOnScroll') animationClass: string = 'animate-fade-in-up';
  @Input() animationDelay: string = '0ms';

  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Initial state: hide the element before the animation triggers
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
    
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // Trigger when 10% of the element is visible
    };

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (this.animationDelay !== '0ms') {
            this.renderer.setStyle(this.el.nativeElement, 'animation-delay', this.animationDelay);
          }
          this.renderer.addClass(this.el.nativeElement, this.animationClass);
          
          // Stop observing once animated
          observer.unobserve(entry.target);
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
