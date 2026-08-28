import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContractSummary, ContractDetail } from '../models/contract.models';

export interface UploadResponse {
  message: string;
  contractId: string;
  auditReportId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/contracts`;

  uploadContract(file: File, userRole: number): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userRole', userRole.toString());

    // We do not set Content-Type header manually when using FormData, 
    // the browser sets it automatically with the correct boundary.
    return this.http.post<UploadResponse>(`${this.apiUrl}/upload`, formData);
  }

  getMyContracts(): Observable<ContractSummary[]> {
    return this.http.get<ContractSummary[]>(this.apiUrl);
  }

  getContractDetails(id: string): Observable<ContractDetail> {
    return this.http.get<ContractDetail>(`${this.apiUrl}/${id}`);
  }
}
