import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

console.log('React: Main script loaded');

let isMounted = false;

function mountReactApp() {
  if (isMounted) {
    console.log('React: App already mounted, skipping');
    return;
  }

  console.log('React: Document state:', document.readyState);
  console.log('React: Full body content:', document.body.innerHTML);
  const container = document.getElementById('react-app');
  if (!container) {
    console.error('React: Container not found');
    console.log('React: All divs:', document.querySelectorAll('div'));
    return;
  }

  // Clear any existing content
  container.innerHTML = '';
  
  console.log('React: Container found, mounting app');
  try {
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    isMounted = true;
  } catch (error) {
    console.error('React: Failed to mount app:', error);
    container.innerHTML = '<div class="error-message">Failed to load recipe carousel. Please refresh the page.</div>';
  }
}

// Wait for all dependencies to be ready
window.addEventListener('allDependenciesReady', () => {
  console.log('React: All dependencies ready, proceeding with mount');
  mountReactApp();
});

// Fallback: try mounting on window.load
if (document.readyState === 'complete') {
  mountReactApp();
} else {
  window.addEventListener('load', () => {
    console.log('React: Window load event, attempting to mount');
    mountReactApp();
  }, { once: true });
}
