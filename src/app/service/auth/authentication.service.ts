
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment as env } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthentictionService {

  constructor(private http: HttpClient) { }
  private isLoggedIn = false;

  login(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    return this.http.post(`${env.BASE_URL}Authentication`, data, { headers })
      .pipe(
        map((response: any) => {
          if (response.status == 'Success') {
            localStorage.setItem('token', response.token);
            this.isLoggedIn = true;
            return true;
          } else {
            return false;
          }
        }),
        catchError((error: any) => {
          console.error('Error in login:', error);
          return of(false); 
        })
      );
  }


  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }


  GetVoucherListByMembNo(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${env.BASE_URL}Authentication/GetVoucherListByMembNo`, data, { headers });
  }

  RedeemVoucher(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${env.BASE_URL}Authentication/RedeemVoucher`, data, { headers });
  }
}
