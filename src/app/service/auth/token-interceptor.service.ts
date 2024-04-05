import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private injector: Injector, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the token from local storage
    const token = localStorage.getItem('token');

    // Clone the request to add the token to the headers
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // Handle the request and catch errors
    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status == 0) {
          // Token expired or unauthorized, redirect to login page
          this.router.navigate(['/login']);
        }

        // Propagate the error using throwError from the 'rxjs' package
        return throwError(() => error);
      }),
      finalize(() => {
      })
    );
  }
}
