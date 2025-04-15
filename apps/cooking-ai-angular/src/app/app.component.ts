import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment'; // Import environment

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
  score: number;
}

@Component({
  selector: 'cooking-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold mb-4 text-primary">Generate Recipes</h2>
      <form (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label for="ingredients" class="block text-sm font-medium text-gray-700">Ingredients (comma-separated)</label>
          <input
            id="ingredients"
            type="text"
            [(ngModel)]="ingredients"
            name="ingredients"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="e.g., chicken, rice, tomatoes"
          />
        </div>
        <div>
          <label for="cuisine" class="block text-sm font-medium text-gray-700">Cuisine</label>
          <select
            id="cuisine"
            [(ngModel)]="cuisine"
            name="cuisine"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="">Select cuisine</option>
            <option value="Italian">Italian</option>
            <option value="Mexican">Mexican</option>
            <option value="Japanese">Japanese</option>
            <option value="Indian">Indian</option>
          </select>
        </div>
        <div>
          <label for="dietary" class="block text-sm font-medium text-gray-700">Dietary Preference</label>
          <select
            id="dietary"
            [(ngModel)]="dietary"
            name="dietary"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="">Select dietary preference</option>
            <option value="none">None</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten-free">Gluten-Free</option>
          </select>
        </div>
        <button
          type="submit"
          [disabled]="loading"
          class="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition"
        >
          {{ loading ? 'Generating...' : 'Generate Recipes' }}
        </button>
        <p *ngIf="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
      </form>
    </div>
  `,
  styles: [],
})
export class AppComponent implements OnInit, AfterViewInit {
  ingredients = '';
  cuisine = '';
  dietary = '';
  loading = false;
  error = '';

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
      }
    };
  }

  ngAfterViewInit() {
    console.log('Angular: View initialized');
    setTimeout(() => {
      window.dispatchEvent(new Event('angularReady'));
    }, 0);
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    console.log('Angular: Submitting form', this.ingredients, this.cuisine, this.dietary);
    console.log('Angular: Starting HTTP request');
    const requestBody = {
      ingredients: this.ingredients,
      cuisine: this.cuisine,
      dietary: this.dietary,
    };
    console.log('Angular: Request body', requestBody);

    fetch(`${environment.apiBaseUrl}/api/generate-recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Angular: Fetch API request successful');
        console.log('Angular: Recipes received', data);
        if (data && data.length) {
            const sanitizedData: Recipe[] = data.map((recipe: Partial<Recipe>) => ({
            title: recipe.title || 'Untitled Recipe',
            description: recipe.description || 'No description available.',
            score: recipe.score || 0,
            }));
          console.log('Angular: Sanitized data structure', JSON.stringify(sanitizedData, null, 2));
          window.eventBus.emit('recipesLoaded', sanitizedData);
        }
        this.loading = false;
      })
      .catch(err => {
        console.error('Angular: Fetch API error details:', err);
        this.error = 'Failed to generate recipes. Please try again.';
        this.loading = false;
      });
  }

  submitVote(recipeId: number, vote: 'up' | 'down') {
    console.log('Angular: Submitting vote', recipeId, vote);
    const requestBody = { recipeId, vote };
    console.log('Angular: Vote request body', requestBody);
    this.http
      .post(`${environment.apiBaseUrl}/api/vote`, requestBody)
      .subscribe({
        next: () => {
          console.log('Angular: Vote submitted, re-fetching recipes');
          this.onSubmit();
        },
        error: (err) => {
          console.error('Angular: Error submitting vote:', JSON.stringify(err, null, 2));
          this.error = 'Failed to submit vote. Please try again.';
        },
      });
  }
}
