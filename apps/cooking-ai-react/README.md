# React App - The Recipe Carousel

## Features

Shows 6 recipe cards in a slick carousel, with a modal for full details when you click a card.
Lets you upvote or downvote recipes, sorting them by popularity in real-time.
Styled with Tailwind CSS to match the Angular form.

## How I Built It
I built the carousel in React 18, located in apps/cooking-ai-react/. I used Module Federation to load the React app into the Angular app dynamically. The build command is:

```bash

Copy
nx run cooking-ai-react:build:tailwind:prod
The output goes to recipes/, with an index.html for Vercel to serve as a static asset. I used Swiper.js for the carousel and a shared service to get recipe data from Angular. Upvotes and downvotes update a local state and re-sort the carousel.

```

## Thought Process
I picked React for the carousel because it’s great for dynamic, interactive stuff like carousels and modals. Module Federation let me keep Angular and React separate but still talk to each other. The upvote/downvote feature was my innovative twist—I wanted users to feel engaged with the recipes, not just passively scrolling.

## Challenges
Module Federation setup was a headache. I had to tweak Webpack configs to make sure Angular could load the React app without crashing.
Sorting recipes by votes in real-time slowed down the carousel on big datasets. I had to debounce the sorting to keep it smooth.


## Future Improvements
Add animations to the carousel transitions—they’re a bit flat right now.
Store votes in local storage so they don’t reset on refresh.
API - The Recipe Generator

