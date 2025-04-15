import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import 'zone.js'; 

console.log('Angular: Bootstrapping application');

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ]
})
  .then(() => console.log('Angular: Bootstrapped successfully'))
  .catch(err => console.error('Angular bootstrap error:', err));
