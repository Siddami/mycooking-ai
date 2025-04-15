# MyCookingAI - AI-Driven Recipe Recommendation System

## Overview
Hey there! I’m excited to walk you through MyCookingAI, a web app I built to make cooking a breeze by recommending personalized recipes using AI. This project was part of a task to create an innovative feature that combines Angular and React in an Nx monorepo, and I went with an AI-driven recipe recommendation system. I’ll cover what the app does, the cool features I packed in, the hurdles I hit, and how I tackled them. Let’s dive in!

## What’s MyCookingAI All About?
MyCookingAI lets you type in ingredients you’ve got (like “rice, tomatoes, onions”), pick a cuisine (say, Italian), and choose a dietary preference (like vegetarian). It then generates 6 unique recipes using the Google Gemini API and shows them in a slick carousel where you can upvote or downvote to sort by popularity. I built this in an Nx monorepo, using Angular for the input form, React for the recipe carousel, and a NestJS API to handle the AI part. The whole thing’s styled with Tailwind CSS for a consistent look and deployed on Vercel with the code hosted on GitHub.

## Key Features
Here’s what makes MyCookingAI stand out:

 1. AI-Driven Recipe Recommendations:
    You input ingredients, cuisine, and dietary preferences.
    The app uses the Google Gemini API to generate 6 tailored recipes.
    It’s smart enough to handle specific needs—like vegetarian recipes for Italian cuisine.

 2. Angular + React Integration:
    Angular handles the form where you enter your preferences.
    React powers a dynamic carousel to display recipes, with a modal for full details.
    I used Module Federation to load the React app into Angular, making them work together seamlessly.

 3. Interactive Recipe Sorting:
    You can upvote or downvote recipes in the carousel.
    The carousel sorts recipes by popularity in real-time based on your votes.

 4. Consistent Styling:
    Tailwind CSS keeps the Angular form and React carousel looking sharp and uniform.
    No clashing styles—just a clean, user-friendly vibe.

 5. Production-Ready Deployment:
    Deployed on Vercel at [ https://mycooking-ai-app.vercel.app/].
    Code is on GitHub with clear commit messages for review.

## How I Built It
I set up an Nx monorepo to manage everything, since I needed Angular and React to play nice together. Here’s the breakdown:

1. Nx Workspace:
    Used Nx to manage all apps (Angular, React, API) in one repo.
    Set it up with npx create-nx-workspace@latest mycooking-ai --preset=apps, then added Angular, React, and NestJS apps manually.
    Nx handled builds, like nx build cooking-ai-angular, and kept dependencies in check.

2. Angular Form:
    Built in apps/cooking-ai-angular/ with Angular 18.
    Created a reactive form for user inputs, sending them to the API via HttpClient.
    Output goes to form/, with index.html renamed to index-angular.html.

3. React Carousel:
    Built in apps/cooking-ai-react/ with React 18.
    Used Swiper.js for the carousel and added upvote/downvote buttons with real-time sorting.
    Output goes to recipes/, served as a static asset on Vercel.

4. NestJS API:
    Built in api/ using NestJS.
    Set up a /generate-recipes endpoint to call the Gemini API with user inputs.
    Output goes to api/, with main.js as the entry point for Vercel’s serverless functions.

5. Module Federation:
    Used Module Federation to load the React carousel into Angular.
    Set up a shared service with RxJS to pass recipe data from Angular to React.

6. Deployment:
    Used a vercel.json to define builds and routes:

```json

Copy
{
  "buildCommand": "nx build cooking-ai-angular --configuration=production && nx run cooking-ai-react:build:tailwind:prod && nx build cooking-ai-api",
  "outputDirectory": ".",
  "builds": [
    { "src": "api/main.js", "use": "@vercel/node" },
    { "src": "form/**", "use": "@vercel/static" },
    { "src": "recipes/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "api/main.js" },
    { "src": "/form/(.*)", "dest": "/form/$1" },
    { "src": "/recipes/(.*)", "dest": "/recipes/$1" },
    { "src": "/", "dest": "/form/index-angular.html" }
  ]
}
```

Deployed on Vercel via their website, added GEMINI_API_KEY in Settings > Environment Variables.

## Challenges I Faced
This wasn’t a walk in the park—here’s what gave me a hard time:

    1. Integrating Angular and React:
        Getting Angular and React to talk to each other was tough. I needed the Angular form to send recipe data to the React carousel without breaking.
        Module Federation configs were a nightmare—CORS errors kept popping up, and the React app wouldn’t load right.
    2. Google Gemini API Issues:
        The Gemini API sometimes gave weird recipes, like suggesting meat for a vegetarian request.
        Rate limits and timeouts made testing a pain—I’d get errors mid-development.
    3. Vercel Deployment Struggles:
        I struggled to set up the GEMINI_API_KEY in Vercel’s dashboard—it kept failing until I figured out the right spot.
        Vercel didn’t pick up my monorepo structure at first, and the deployment failed until I added the vercel.json.
    4. Real-Time Sorting Performance:
        Sorting recipes by votes in the React carousel slowed things down when I had a lot of data.
        Users would notice lag when upvoting or downvoting quickly.

## Solutions I Came Up With
Here’s how I tackled those challenges:

    1. Angular + React Integration:
        I used Module Federation to load the React carousel into Angular, setting up the React app as a remote in Angular’s Webpack config.
        Added a shared service with RxJS BehaviorSubject to pass recipe data from Angular to React, with a delay to ensure React was ready.
    2. Gemini API Fixes:
        Tweaked the API prompt to be super specific, like “Generate 6 vegetarian recipes using rice, tomatoes, onions for Italian cuisine.”
        Added a retry mechanism in the NestJS API—if the Gemini API fails, it tries again up to 3 times before giving up.
    3. Vercel Deployment:
        Added the GEMINI_API_KEY in Vercel’s Settings > Environment Variables, making sure to select the Production environment.
        Used a vercel.json to tell Vercel exactly how to handle my monorepo—API at api/main.js, Angular at form/, React at recipes/.
    4. Sorting Performance:
        Debounced the sorting function in React so it only runs after the user stops voting for 300ms—no more lag.
        Kept the vote state in memory to avoid re-rendering the whole carousel on every vote.

## Why This Project Rocks
    1. Innovation: The AI-driven recipe system is a fresh take on cooking apps—using the Gemini API to generate recipes tailored to your exact needs is pretty cool. Plus, the upvote/downvote sorting adds a fun, interactive twist.
    Technical Complexity: Combining Angular and React in an Nx monorepo with Module Federation was no small feat. Add in the AI integration and real-time sorting, and this project pushed my skills hard.
    2.Presentation: I’ve laid out everything clearly here and in the README on GitHub, with all the details on features, challenges, and solutions.

## How to Check It Out
Deployed URL: [ https://mycooking-ai-app.vercel.app/]

Go to the Vercel URL.

Type ingredients (e.g., “rice, tomatoes, onions”), pick a cuisine (e.g., Italian), and a dietary preference (e.g., vegetarian).

Hit “Generate Recipes” to see 6 recipes in the carousel.

Upvote or downvote recipes to sort them by popularity.

## Wrapping Up
MyCookingAI is a project I’m proud of—it’s innovative, technically tricky, and solves a real problem for folks who want quick, personalized recipes. I hit some rough patches, but I got it done by the deadline (April 15, 2025), and it’s live on Vercel for you to try. Thanks for checking it out—I’d love to hear what you think!

## Screenshots before production 
![screenshot](/screen1.png)
![screenshot](/screen2.png)