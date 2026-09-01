import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideFileText, lucideCalendar, lucideShieldAlert, lucidePlus } from '@ng-icons/lucide';
import { NavbarComponent } from '../../shared/layouts/navbar/navbar.component';
import { UiButtonComponent } from '../../shared/components/ui/ui-button/ui-button.component';
import { ContractService } from '../../core/services/contract.service';
import { ContractSummary } from '../../core/models/contract.models';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [CommonModule, TranslatePipe, NgIconComponent, RouterModule, NavbarComponent, UiButtonComponent],
  providers: [provideIcons({ lucideFileText, lucideCalendar, lucideShieldAlert, lucidePlus })],
  templateUrl: './contracts.component.html'
})
export class ContractsComponent implements OnInit {
  private contractService = inject(ContractService);
  
  contracts$: Observable<ContractSummary[]> | undefined;

  ngOnInit() {
    this.contracts$ = this.contractService.getMyContracts();
  }
}
