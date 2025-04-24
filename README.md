# MyCookingAI - AI-Driven Recipe Recommendation System

## Overview
Hey there! I’m excited to walk you through MyCookingAI, a web app I built to make cooking a breeze by recommending personalized recipes using AI. This project was part of a task to create an innovative feature combining Angular and React in an Nx monorepo, and I chose to build an AI-driven recipe recommendation system. I’ll cover what the app does, its standout features, the hurdles I faced, and how I overcame them. Let’s dive in!

## What’s MyCookingAI All About?
MyCookingAI lets you input ingredients you have (like “rice, tomatoes, onions”), select a cuisine (e.g., Italian), and choose a dietary preference (e.g., vegetarian). It generates 6 unique recipes using the Google Gemini API and displays them in a sleek carousel where you can upvote or downvote to sort by popularity. I built this in an Nx monorepo, using Angular for the input form, React for the recipe carousel, and a NestJS API to handle AI interactions. The app is styled with Tailwind CSS for a consistent look, deployed on Vercel (frontend) and Render (API), with the code hosted on GitHub.

## Key Features
Here’s what makes MyCookingAI stand out:

1. AI-Driven Recipe Recommendations:
    Input ingredients, cuisine, and dietary preferences.
    Uses the Google Gemini API to generate 6 tailored recipes.
    Handles specific needs, like vegetarian Italian recipes.
2. Angular + React Integration:
    Angular powers the form for user inputs.
    React drives a dynamic recipe carousel with a modal for full details.
    Used an event bus (window.eventBus) to pass data between Angular and React, ensuring seamless communication.
3. Interactive Recipe Sorting:
    Upvote or downvote recipes in the carousel.
    Recipes sort by popularity in real-time based on votes.
4. Consistent Styling:
    Tailwind CSS ensures the Angular form and React carousel have a uniform, user-friendly design.
    No style clashes—just a clean, cohesive look.
5. Production-Ready Deployment:

Frontend deployed on Vercel at [https://mycooking-ai.vercel.app/].
API deployed on Render at https://cooking-ai-api.onrender.com/.
Code hosted on GitHub with clear commit messages for review.

## How I Built It
I used an Nx monorepo to manage the Angular, React, and NestJS apps in one repository. Here’s the breakdown:

1. Nx Workspace:
    Set up with npx create-nx-workspace@latest mycooking-ai --preset=apps, then added Angular, React, and NestJS apps.
    Nx managed builds (e.g., nx build cooking-ai-angular) and dependencies efficiently.
2. Angular Form:
    Built in apps/cooking-ai-angular/ with Angular 18 (standalone components).
    Created a reactive form for user inputs, sending data to the API via HttpClient.
    Output to dist/form/, with --base-href=/form/ for routing.
3. React Carousel:
    Built in apps/cooking-ai-react/ with React 18.
    Used Swiper.js for the carousel, with upvote/downvote buttons and real-time sorting.
    Output to dist/recipes/, served as static assets on Vercel.
4. NestJS API:
    Built in api/ using NestJS.
    Created a /api/vote endpoint to handle voting and a /generate-recipes endpoint to call the Gemini API.
    Deployed on Render at https://cooking-ai-api.onrender.com/.

### Frontend-Backend Connection:
Angular form sends requests to the Render API (e.g., https://cooking-ai-api.onrender.com/api/generate-recipes).
React carousel sends vote updates to https://cooking-ai-api.onrender.com/api/vote.
Added CORS headers in NestJS to allow requests from https://mycooking-ai.vercel.app.

## Deployment:
Frontend (Vercel): Used a vercel.json to define builds and routes.
Committed dist/ to Git (removed from .gitignore) to ensure Vercel uses the built files.
Added GEMINI_API_KEY in Vercel’s Settings > Environment Variables.
API (Render): Deployed the NestJS API from the api/ directory, set GEMINI_API_KEY in Render’s environment variables, and exposed it at https://cooking-ai-api.onrender.com/.
Challenges I Faced
This project had its share of challenges:

## Integrating Angular and React:
1. Originally planned to use Module Federation, but faced CORS and Webpack config issues.
2. Switched to a simpler event bus (window.eventBus) to pass recipe data between Angular and React.

3. Google Gemini API Issues:
    The Gemini API sometimes generated incorrect recipes (e.g., meat in vegetarian requests).
    Rate limits and timeouts disrupted development.
4. Vercel Deployment Struggles:
    Initial 404 errors because dist/ was in .gitignore, so Vercel couldn’t find the files.
    Old builds persisted due to caching and static asset names (e.g., main.js).
5. Real-Time Sorting Performance:
    Sorting recipes by votes in the React carousel caused lag with frequent updates.
6. Stylesheet Warning:
    Angular build warned: Unable to locate stylesheet: /assets/styles.css.

## Solutions I Came Up With
Here’s how I addressed those challenges:

1. Angular + React Integration:
    Abandoned Module Federation due to complexity.
    Used a global window.eventBus with RxJS BehaviorSubject to share data between Angular and React, adding a delay to ensure React was ready.
2. Gemini API Fixes:
    Refined the API prompt (e.g., “Generate 6 vegetarian recipes using rice, tomatoes, onions for Italian cuisine”).
    Added a retry mechanism in the NestJS API (up to 3 retries on failure).
3. Vercel Deployment:
    Removed dist/ from .gitignore, committed the built files, and forced a clean build with vercel --prod --force.
    Added asset hashing in Angular (outputHashing: "all") and Vite (entryFileNames: "assets/[name].[hash].js") to bust browser/CDN caches.
    Updated vercel.json to ensure npm run prepare-deploy runs on each deploy, with rm -rf dist/ to avoid cache issues.
4. Sorting Performance:
    Debounced the sorting function in React (300ms delay) to reduce re-renders.
    Stored vote state in memory to avoid full carousel updates.
5. Stylesheet Warning:
    Updated angular.json to include "styles": ["src/assets/styles.css"].
    Copied assets/styles.css to dist/assets/styles.css in prepare-deploy to match the expected path.

## Why This Project Rocks
1. Innovation: An AI-driven recipe system using the Gemini API, with interactive voting, makes cooking fun and personalized.
2. Technical Complexity: Combining Angular, React, and NestJS in an Nx monorepo, with a deployed frontend and backend, showcases advanced skills.
3. Presentation: Clear documentation here and in the GitHub README, detailing features, challenges, and solutions.
How to Check It Out
Deployed URL: [https://mycooking-ai.vercel.app/]

1. Visit the Vercel URL.
2. Enter ingredients (e.g., “rice, tomatoes, onions”), pick a cuisine (e.g., Italian), and a dietary preference (e.g., vegetarian).
3. Click “Generate Recipes” to see 6 recipes in the carousel.
4. Upvote or downvote recipes to sort them by popularity.

## Wrapping Up
MyCookingAI is a project I’m proud of—it’s innovative, technically challenging, and solves a real problem for anyone seeking quick, personalized recipes. I faced some tough hurdles but delivered it by the deadline (April 15, 2025), and it’s now live on Vercel and Render for you to try. Thanks for checking it out—I’d love to hear your feedback!

## Screenshots before production 
![screenshot](/screen1.png)
![screenshot](/screen2.png)