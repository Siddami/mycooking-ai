# Angular App - The Recipe Input Form

## Features
A clean form where you type in ingredients (like “rice, tomatoes, onions”), pick a cuisine (e.g., Italian), and choose a dietary preference (e.g., vegetarian).
Sends the data to the API and passes the response to the React carousel.
Styled with Tailwind CSS for a sharp, consistent look.


## How I Built It
I built the form in Angular 18, living in apps/cooking-ai-angular/. The form uses reactive forms for validation:

```typescript

Copy
this.recipeForm = this.formBuilder.group({
  ingredients: ['', Validators.required],
  cuisine: [''],
  dietaryPreference: ['']
});
When you submit, it hits the API at /api/generate-recipes using Angular’s HttpClient, then sends the recipes to the React carousel via a shared service. I built the app with:
```

```bash

Copy
nx build cooking-ai-angular --configuration=production --skip-nx-cache
The output goes to form/, with index.html renamed to index-angular.html to avoid conflicts.
```

## Thought Process
I chose Angular for the form because I’m comfy with its reactive forms, and I needed strong validation to make sure users don’t send junk data to the API. Tailwind CSS was a no-brainer for styling—I wanted the form to look good and match the React carousel without fighting over CSS.

## Challenges
Getting Angular to talk to React was tricky. I used a shared service to pass data, but I had to make sure the React carousel loaded after the API response came back, or it’d break.
The build output had a browser/ subfolder sometimes, which messed up Vercel’s routing. I added a script to flatten the output into form/.

## Future Improvements
Add more form validation—like checking for valid ingredients with a regex.
Make the form fancier with animations when you submit.