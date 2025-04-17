import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

declare global {
  interface Window {
    eventBus: {
      emit: (event: string, data: any) => void;
      on: (event: string, callback: (data: any) => void) => void;
      listeners: { [key: string]: Array<(data: any) => void> };
      latestData: { [key: string]: any };
    };
  }
}

interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  score: number;
}

@Component({
  selector: 'cooking-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent implements OnInit, AfterViewInit {
  ingredients = '';
  cuisine = '';
  dietary = '';
  loading = false;
  error = '';

  private readonly API_BASE_URL = environment.apiBaseUrl;

  constructor(private http: HttpClient) {
    console.log('Angular: HttpClient instance', this.http);
  }

  ngOnInit() {
    console.log('Angular: AppComponent initialized');
    window.eventBus = window.eventBus || {
      listeners: {},
      latestData: {},
      emit(event: string, data: any) {
        console.log('EventBus: Emitting', event, data);
        this.latestData[event] = data;
        if (this.listeners[event]) {
          this.listeners[event].forEach((callback: (data: any) => void) => callback(data));
        }
      },
      on(event: string, callback: (data: any) => void) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(callback);
        if (this.latestData[event]) {
          console.log(`EventBus: Calling new listener with latest ${event} data`);
          callback(this.latestData[event]);
        }
      },
      off(event: string, callback?: (data: any) => void) {
        if (callback && this.listeners[event]) {
          const index = this.listeners[event].indexOf(callback);
          if (index > -1) {
            this.listeners[event].splice(index, 1);
          }
        } else {
          this.listeners[event] = [];
        }
      },
    };

    // Listen for vote events from React
    window.eventBus.on('submitVote', ({ recipeId, vote }) => {
      console.log('Angular: Received vote event', { recipeId, vote });
      this.submitVote(recipeId, vote);
    });

    // Test API connectivity on init
    this.checkApiHealth();
  }

  ngAfterViewInit() {
    console.log('Angular: View initialized');
    setTimeout(() => {
      window.dispatchEvent(new Event('angularReady'));
    }, 0);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  private checkApiHealth() {
    this.http
      .get(`${this.API_BASE_URL}/health`)
      .pipe(catchError(this.handleError))
      .subscribe({
        next: (response) => {
          console.log('API Health Check:', response);
        },
        error: (err) => {
          console.error('API Health Check Failed:', err.message);
          this.error = 'API is not reachable. Please try again later.';
        },
      });
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    console.log('Angular: Submitting form', this.ingredients, this.cuisine, this.dietary);

    const requestBody = {
      ingredients: this.ingredients,
      cuisine: this.cuisine,
      dietary: this.dietary || 'none',
    };
    console.log('Angular: Request body', requestBody);

    this.http
      .post<Recipe[]>(`${this.API_BASE_URL}/generate-recipes`, requestBody)
      .pipe(catchError(this.handleError))
      .subscribe({
        next: (data) => {
          console.log('Angular: Recipes received', data);
          if (data && data.length) {
            const sanitizedData: Recipe[] = data.map((recipe: Partial<Recipe>) => ({
              title: recipe.title || 'Untitled Recipe',
              description: recipe.description || 'No description available.',
              ingredients: recipe.ingredients || [],
              instructions: recipe.instructions || [],
              score: recipe.score || 0,
            }));
            console.log('Angular: Sanitized data structure', JSON.stringify(sanitizedData, null, 2));
            window.eventBus.emit('recipesLoaded', sanitizedData);
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Angular: Error generating recipes:', err.message);
          this.error = 'Failed to generate recipes. Please try again.';
          this.loading = false;
        },
      });
  }

  submitVote(recipeId: number, vote: 'up' | 'down') {
    console.log('Angular: Submitting vote', recipeId, vote);
    const requestBody = { recipeId, vote };
    console.log('Angular: Vote request body', requestBody);
    this.http
      .post(`${this.API_BASE_URL}/vote`, requestBody)
      .pipe(catchError(this.handleError))
      .subscribe({
        next: () => {
          console.log('Angular: Vote submitted, re-fetching recipes');
          this.onSubmit();
        },
        error: (err) => {
          console.error('Angular: Error submitting vote:', err.message);
          this.error = 'Failed to submit vote. Please try again.';
        },
      });
  }
}