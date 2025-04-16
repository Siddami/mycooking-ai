import React, { useState, useEffect } from 'react';
import RecipeCarousel from './components/RecipeCarousel';
import RecipeModal from './components/RecipeModal';

const App = ({ initialRecipes }) => {
  const [recipes, setRecipes] = useState(initialRecipes || []);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    window.eventBus?.on('recipesLoaded', (data) => {
      console.log('React: Received recipes via eventBus', data);
      setRecipes(data);
    });

    const container = document.getElementById('react-app');
    if (container) {
      container.addEventListener('recipesUpdated', (e) => {
        const customEvent = e as CustomEvent;
        console.log('React: Recipes updated', customEvent.detail);
        setRecipes(customEvent.detail);
      });
    }
  }, []);

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="recipe-carousel-container">
      {recipes.length > 0 ? (
        <RecipeCarousel recipes={recipes} onRecipeClick={handleRecipeClick} />
      ) : (
        <div className="text-center py-4">No recipes available.</div>
      )}
      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;