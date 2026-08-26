import { Component, HostListener, OnInit, OnDestroy, OnChanges, SimpleChanges, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  lucideMail, lucideFileText, lucideMapPin, lucideClock, lucideShoppingCart, 
  lucideSearch, lucideShieldCheck, lucideBriefcase, lucideActivity, lucideCheckCircle 
} from '@ng-icons/lucide';
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

@Component({
  selector: 'app-audit-illustration',
  standalone: true,
  imports: [
    CommonModule, 
    NgIconComponent
  ],
  viewProviders: [
    provideIcons({ 
      lucideMail, lucideFileText, lucideMapPin, lucideClock, lucideShoppingCart,
      lucideSearch, lucideShieldCheck, lucideBriefcase, lucideActivity, lucideCheckCircle
    })
  ],
  templateUrl: './audit-illustration.component.html',
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: auto;
    }
    
    .spin-ring {
      animation: spin 8s linear infinite;
    }
    
    .counter-spin {
      animation: counter-spin 8s linear infinite;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }
    
    @keyframes counter-spin {
      100% { transform: rotate(-360deg); }
    }

    .lens-text-fade {
      transition: opacity 0.3s ease-in-out;
    }
  `]
})
export class AuditIllustrationComponent implements OnInit, OnDestroy, OnChanges {
  @Input() file: File | null = null;
  @Input() theme: 'light' | 'dark' = 'light';
  pdfPageImageUrl: string | null = null;

  get iconClasses(): string {
    return this.theme === 'dark'
      ? 'border-brandYellow/30 text-brandYellow/60'
      : 'border-black/20 text-black/40';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['file']) {
      this.pdfPageImageUrl = null;
      if (this.file) {
        this.renderPdfFirstPage(this.file);
      }
    }
  }

  private async renderPdfFirstPage(file: File): Promise<void> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      
      // Render at high resolution for crisp display
      const scale = 2;
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({ canvas, viewport }).promise;
      
      this.pdfPageImageUrl = canvas.toDataURL('image/png');
    } catch (e) {
      console.error('Failed to render PDF page:', e);
    }
  }
  glassLeft = 50;
  glassTop = 38;
  
  isDragging = false;
  isAutoScanning = true;
  animationFrameId?: number;
  scanTime = 0;

  startX = 0;
  startY = 0;
  startLeft = 0;
  startTop = 0;
  
  lastPhraseX = 0;
  lastPhraseY = 0;

  phrases = [
    'Scanning clause 4.2 for regulatory compliance...',
    'Detecting hidden liabilities in Section 8...',
    'Cross-referencing governing law provisions...',
    'Identifying non-standard indemnification terms...',
    'Analyzing unusual termination conditions...',
    'Validating strict confidentiality terms...',
    'Extracting key financial obligations...',
    'Flagging potential IP ownership disputes...'
  ];
  currentPhrase = 'Scanning clause 4.2 for regulatory compliance...';

  get isOverText(): boolean {
    return this.glassTop >= 30 && this.glassTop <= 68 && this.glassLeft >= 30 && this.glassLeft <= 70;
  }

  get isLensActive(): boolean {
    return (this.isDragging || this.isAutoScanning) && this.isOverText;
  }

  ngOnInit() {
    this.startAutoScan();
  }

  ngOnDestroy() {
    this.stopAutoScan();
  }

  startAutoScan() {
    const scanLoop = () => {
      if (!this.isAutoScanning) return;
      
      this.scanTime += 0.015; 
      
      // Smart reading simulation (LTR/RTL line by line)
      const numLines = 15;
      const readSpeed = 1.2;
      const returnSpeed = 0.4;
      const lineTime = readSpeed + returnSpeed;
      
      // Calculate when it finishes reading the last line
      const scanCompleteTime = (numLines - 1) * lineTime + readSpeed;
      
      if (this.scanTime >= scanCompleteTime) {
        this.scanTime = 0; // Loop back to the top
      }
      
      const currentTime = this.scanTime;
      const currentLine = Math.floor(currentTime / lineTime);
      const timeInLine = currentTime % lineTime;
      
      const startX = 31;
      const endX = 69;
      const startY = 29;
      const endY = 72;
      const lineSpacing = (endY - startY) / (numLines - 1);
      
      // Detect LTR or RTL
      const isRTL = document.documentElement.dir === 'rtl' || document.body.dir === 'rtl';
      const actualStartX = isRTL ? endX : startX;
      const actualEndX = isRTL ? startX : endX;
      
      let currentX: number;
      let currentY: number;
      
      if (timeInLine < readSpeed) {
        // Reading phase
        const progress = timeInLine / readSpeed;
        currentX = actualStartX + (actualEndX - actualStartX) * progress;
        currentY = startY + currentLine * lineSpacing;
      } else {
        // Return phase (moving to next line)
        const progress = (timeInLine - readSpeed) / returnSpeed;
        const nextLine = (currentLine + 1) % numLines;
        
        // Easing for smooth return (sine wave easing)
        const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
        
        currentX = actualEndX + (actualStartX - actualEndX) * easeProgress;
        
        const currentLineY = startY + currentLine * lineSpacing;
        const nextLineY = startY + nextLine * lineSpacing;
        
        currentY = currentLineY + (nextLineY - currentLineY) * easeProgress;
      }
      
      this.glassLeft = currentX;
      this.glassTop = currentY;

      // Check distance for phrase update
      if (Math.abs(this.glassLeft - this.lastPhraseX) + Math.abs(this.glassTop - this.lastPhraseY) > 5) {
        this.pickRandomPhrase();
        this.lastPhraseX = this.glassLeft;
        this.lastPhraseY = this.glassTop;
      }

      this.animationFrameId = requestAnimationFrame(scanLoop);
    };
    
    this.animationFrameId = requestAnimationFrame(scanLoop);
  }

  stopAutoScan() {
    this.isAutoScanning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  onDragStart(event: MouseEvent | TouchEvent) {
    this.stopAutoScan(); // Immediately stop auto animation if user interacts

    if (event.cancelable) {
      event.preventDefault();
    }
    this.isDragging = true;
    this.pickRandomPhrase();

    if (event instanceof MouseEvent) {
      this.startX = event.clientX;
      this.startY = event.clientY;
    } else if (event.touches && event.touches.length > 0) {
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    }
    
    this.lastPhraseX = this.startX;
    this.lastPhraseY = this.startY;
    this.startLeft = this.glassLeft;
    this.startTop = this.glassTop;
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onDrag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    
    let currentX = 0;
    let currentY = 0;

    if (event instanceof MouseEvent) {
      currentX = event.clientX;
      currentY = event.clientY;
    } else if (event.touches && event.touches.length > 0) {
      currentX = event.touches[0].clientX;
      currentY = event.touches[0].clientY;
    }

    const diffX = currentX - this.startX;
    const diffY = currentY - this.startY;

    const sensitivity = 0.25; 
    
    let newLeft = this.startLeft + (diffX * sensitivity);
    let newTop = this.startTop + (diffY * sensitivity);

    this.glassLeft = Math.max(30, Math.min(70, newLeft));
    this.glassTop = Math.max(25, Math.min(78, newTop));
    
    // Change phrase rapidly on slight movement (e.g., 5 pixels)
    if (Math.abs(currentX - this.lastPhraseX) + Math.abs(currentY - this.lastPhraseY) > 8) {
      this.pickRandomPhrase();
      this.lastPhraseX = currentX;
      this.lastPhraseY = currentY;
    }
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  onDragEnd() {
    this.isDragging = false;
  }

  pickRandomPhrase() {
    let nextIndex = Math.floor(Math.random() * this.phrases.length);
    this.currentPhrase = this.phrases[nextIndex];
  }
}
