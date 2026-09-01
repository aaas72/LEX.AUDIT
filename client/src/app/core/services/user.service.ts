import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`);
  }

  updateProfile(data: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/me`, data);
  }

  changePassword(data: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, data);
  }

  updateApiKey(apiKey: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/me/api-key`, { apiKey });
  }

  verifyApiKey(): Observable<{ isValid: boolean }> {
    return this.http.get<{ isValid: boolean }>(`${this.apiUrl}/me/api-key/verify`);
  }
}
