# Shell - Tying Angular and React Together


## Features
Uses Module Federation to load the React carousel into the Angular app.
Sets up shared services for Angular and React to pass recipe data.

## How I Built It
I didn’t have a separate “shell” app, but I treated the Angular app as the host and used Module Federation to load the React app. In apps/cooking-ai-angular/module-federation.config.js, I set up the React app as a remote:

```javascript

Copy
remotes: [['cooking-ai-react', 'http://localhost:4201/remoteEntry.js']]

```

I created a shared service in apps/cooking-ai-angular/src/app/shared/ to pass recipe data between Angular and React using RxJS BehaviorSubject.

## Thought Process
I needed Angular and React to work together without a clunky iframe setup. Module Federation was the way to go—it let me load the React carousel into Angular dynamically. The shared service was my way of passing data without tight coupling.

## Challenges
Module Federation configs took forever to get right—I kept getting CORS errors until I set up proper origins.
The shared service sometimes fired too early, before React was ready. I had to add delays to make it reliable.

## Future Improvements
Switch to a more robust state management solution, like NgRx, to handle data sharing.
Make the Module Federation setup more flexible for different environments.
The Innovative Feature - AI-Driven Recipe Recommendation


## What’s So Cool About It?
I built an AI-driven recipe recommendation system that uses both Angular and React. You type your ingredients, cuisine, and dietary preferences into the Angular form, and the NestJS API uses the Google Gemini API to generate 6 recipes. Those recipes show up in a React carousel where you can upvote or downvote them, and they sort by popularity in real-time. It’s a seamless mix of Angular’s form handling, React’s interactivity, and AI-powered recipe generation.

## Challenges
Getting Angular and React to share data was tough—I had to use Module Federation and a shared service, which took a lot of debugging.
The Gemini API wasn’t always reliable, so I had to spend time tweaking prompts to get good recipes.
Solutions
Module Federation let me load React into Angular without breaking the app.
I added a retry mechanism in the API to handle flaky Gemini responses.