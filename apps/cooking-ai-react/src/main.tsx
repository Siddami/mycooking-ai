import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

declare global {
  interface Window {
    mountReactApp?: () => void;
    eventBus?: {
      on: (event: string, callback: (data: any) => void) => void;
    };
  }
}

console.log('React: Main script loaded');

let isMounted = false;
let recipesData = null;
const MOUNT_ELEMENT_ID = 'react-app';

// Listen for recipesLoaded event
window.eventBus?.on('recipesLoaded', (data) => {
  console.log('React: Received recipes via eventBus', data);
  recipesData = data;
  if (isMounted) {
    const container = document.getElementById(MOUNT_ELEMENT_ID);
    if (container) {
      container.dispatchEvent(new CustomEvent('recipesUpdated', { detail: data }));
    }
  }
});

function mountReactApp() {
  if (isMounted) {
    console.log('React: App already mounted, skipping');
    return;
  }

  console.log('React: Document state:', document.readyState);
  console.log('React: Checking for react-app container');
  
  let container = document.getElementById(MOUNT_ELEMENT_ID);
  
  if (!container) {
    console.log(`React: Container #${MOUNT_ELEMENT_ID} not found, trying #root`);
    container = document.getElementById('root');
    if (container) {
      console.log('React: Using #root as container, setting id to react-app');
      container.id = MOUNT_ELEMENT_ID;
    }
  }
  
  if (!container) {
    console.error('React: No suitable container found');
    console.log('React: Document body:', document.body.innerHTML);
    console.log('React: All divs:', Array.from(document.querySelectorAll('div')).map(div => div.id || div.className));
    return;
  }

  console.log(`React: Container found with id ${container.id}, mounting app`);
  try {
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <App initialRecipes={recipesData} />
      </StrictMode>
    );
    isMounted = true;
    console.log('React: App mounted successfully');
    if (recipesData) {
      container.dispatchEvent(new CustomEvent('recipesUpdated', { detail: recipesData }));
    }
  } catch (error) {
    console.error('React: Failed to mount app:', error);
    container.innerHTML = '<div class="error-message">Failed to load recipe carousel. Please refresh the page.</div>';
  }
}

window.mountReactApp = mountReactApp;

function attemptMount(retries = 5, delay = 1000) {
  if (retries === 0) {
    console.error('React: All mount attempts failed');
    return;
  }
  
  mountReactApp();
  
  if (!isMounted) {
    console.log(`React: Retrying mount (${retries} attempts left)`);
    setTimeout(() => attemptMount(retries - 1, delay), delay);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('React: DOMContentLoaded event fired');
  attemptMount();
});

window.addEventListener('load', () => {
  console.log('React: Window load event fired');
  attemptMount();
});

window.addEventListener('allDependenciesReady', () => {
  console.log('React: allDependenciesReady event fired');
  attemptMount();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  console.log(`React: Document already ${document.readyState}, attempting mount`);
  attemptMount();
}