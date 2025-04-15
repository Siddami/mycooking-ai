import { AppComponent } from './app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, HttpInterceptorFn, withInterceptors } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { ApplicationRef } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import 'zone.js';

console.log('Angular: Bootstrapping application');

// Error logging interceptor
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Interceptor: Request URL:', req.url);
  console.log('Interceptor: Request Body:', req.body);
  return next(req).pipe(
    catchError(error => {
      console.error('Interceptor: Full error:', error);
      return throwError(() => error);
    })
  );
};

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([loggingInterceptor]))
  ]
})
  .then((appRef: ApplicationRef) => {
    console.log('Angular: Bootstrapped successfully');
    // Register the custom element
    try {
      const customElement = createCustomElement(AppComponent, { injector: appRef.injector });
      if (!customElements.get('cooking-form')) {
        customElements.define('cooking-form', customElement);
        console.log('Angular: Custom element <cooking-form> registered successfully');
        // Trigger Angular's change detection after registration
        appRef.tick();
      } else {
        console.log('Angular: Custom element <cooking-form> already registered');
      }
    } catch (error) {
      console.error('Angular: Failed to register custom element:', error);
    }
  })
  .catch(err => console.error('Angular bootstrap error:', err));
