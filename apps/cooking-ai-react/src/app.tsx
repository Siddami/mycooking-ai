import { useEffect, useState } from 'react';

declare global {
  interface Window {
    eventBus?: {
      on: (event: string, callback: (data: any) => void) => void;
      listeners?: Record<string, ((data: any) => void)[]>;
    };
  }
}
import RecipeCarousel from './components/RecipeCarousel';
import RecipeModal from './components/RecipeModal';

interface Recipe {
  title: string;
  description: string;
  score: number;
  ingredients?: string[];
  instructions?: string[];
}

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    console.log('React: Mounting component');
    if (!window.eventBus) {
      console.error('React: EventBus not found');
      return;
    }

    console.log('React: EventBus found, setting up listener for recipesLoaded');
    const handleRecipesLoaded = (data: Recipe[]) => {
      console.log('React: Received recipes via eventBus', data);
      // Mock additional details for now
      const enrichedRecipes = data.map(recipe => ({
        ...recipe,
        ingredients: [
          '1 cup rice',
          '2 red peppers, diced',
          '2 tomatoes, chopped',
          '1 onion, sliced',
          '2 tbsp olive oil',
          'Salt and pepper to taste'
        ],
        instructions: [
          'Heat olive oil in a pan over medium heat.',
          'Add onions and sauté until caramelized, about 10 minutes.',
          'Add peppers and tomatoes, cook for 5 minutes.',
          'Stir in rice and 2 cups of water, bring to a boil.',
          'Reduce heat, cover, and simmer for 15 minutes or until rice is cooked.',
          'Season with salt and pepper, serve hot.'
        ]
      }));
      setRecipes(enrichedRecipes);
    };

    window.eventBus.on('recipesLoaded', handleRecipesLoaded);

    return () => {
      console.log('React: Cleaning up eventBus listener');
      if (window.eventBus.listeners && window.eventBus.listeners['recipesLoaded']) {
        window.eventBus.listeners['recipesLoaded'] = window.eventBus.listeners['recipesLoaded'].filter(
          listener => listener !== handleRecipesLoaded
        );
      }
    };
  }, []);

  console.log('React: Rendering with recipes:', recipes);

  const openModal = (recipe: Recipe) => {
    console.log('React: Opening modal for recipe:', recipe.title);
    setSelectedRecipe(recipe);
  };

  const closeModal = () => {
    console.log('React: Closing modal');
    setSelectedRecipe(null);
  };

  return (
    <div className="recipe-carousel">
      {recipes.length === 0 ? (
        <p className='text-center'>No recipes loaded yet.</p>
      ) : (
        <RecipeCarousel recipes={recipes} onRecipeClick={openModal} />
      )}

      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={closeModal} />
      )}
    </div>
  );
};

export default App;
