import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError} from 'rxjs';
import { MessageService } from '../services/message.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private messageService: MessageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {

        if (!environment.production) {
          console.log(err);
        }

        let errMsg = '';

        if (err.error instanceof ErrorEvent) {
          errMsg = `Error: ${err.error.message}`;
        }
        else if (Array.isArray(err.error) && err.error.length) {
          errMsg = `Error: ${err.error[0]}`;
        }
        else if (err.error.errors) {
          errMsg = `Error: ${err.error.errors}`
        }
        else {
          errMsg = `Error Code: ${err.status}, Message: ${err.message}`;
        }
        this.messageService.add(errMsg);
        return throwError(() => new Error(errMsg));
      })
    );
  }
}
