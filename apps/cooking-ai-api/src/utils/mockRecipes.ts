import { Recipe } from '../app/recipes/recipes.service';

export const generateMockRecipes = (ingredients: string, cuisine: string, dietary: string): Recipe[] => {
  const ingredientList = ingredients.split(',').map(item => item.trim());

  return [
    {
      title: `${cuisine || 'Global'} Stuffed Peppers with Rice`,
      description: `A hearty ${cuisine || 'global'} dish where peppers are stuffed with a flavorful rice mixture, baked until tender. Perfect for a ${dietary || 'any'} diet. (Recipe 1 of 6)`,
      ingredients: [
        `${ingredientList[0]} (1 cup)`, // rice
        `${ingredientList[1]} (4 whole, hollowed out)`, // pepper
        `${ingredientList[2]} (2, diced)`, // tomatoes
        `${ingredientList[3]} (1, finely chopped)`, // onions
        'Parmesan cheese (1/2 cup, grated)',
        'Olive oil (2 tbsp)',
        'Salt and pepper (to taste)',
      ],
      instructions: [
        'Preheat oven to 375°F (190°C).',
        'In a pan, heat olive oil and sauté onions until translucent.',
        'Add diced tomatoes and cook for 5 minutes.',
        'Mix in cooked rice, Parmesan, salt, and pepper.',
        'Stuff the hollowed peppers with the rice mixture.',
        'Place peppers in a baking dish, cover with foil, and bake for 30 minutes.',
        'Remove foil and bake for another 10 minutes until peppers are tender.',
      ],
      score: 0,
    },
    {
      title: `${cuisine || 'Global'} Tomato and Pepper Risotto`,
      description: `A creamy ${dietary || 'standard'} risotto bursting with the flavors of fresh tomatoes and peppers. This classic ${cuisine || 'global'} dish is comforting and flavorful. (Recipe 2 of 6)`,
      ingredients: [
        `${ingredientList[0]} (1 cup, Arborio)`, // rice
        `${ingredientList[1]} (2, diced)`, // pepper
        `${ingredientList[2]} (3, chopped)`, // tomatoes
        `${ingredientList[3]} (1, sliced)`, // onions
        'Vegetable broth (4 cups)',
        'White wine (1/2 cup)',
        'Garlic (2 cloves, minced)',
      ],
      instructions: [
        'Heat vegetable broth in a pot and keep it warm.',
        'In a large pan, sauté onions and garlic in olive oil until soft.',
        'Add peppers and tomatoes, cooking for 5 minutes.',
        'Stir in Arborio rice and cook for 2 minutes.',
        'Add white wine and stir until absorbed.',
        'Gradually add warm broth, one ladle at a time, stirring until absorbed, for about 20 minutes.',
        'Season with salt and serve hot.',
      ],
      score: 0,
    },
    {
      title: `${cuisine || 'Global'} Rice Salad with Peppers and Tomatoes`,
      description: `A refreshing ${dietary || 'standard'} rice salad with vibrant peppers and tomatoes, perfect for a light meal. Tossed with a simple olive oil dressing. (Recipe 3 of 6)`,
      ingredients: [
        `${ingredientList[0]} (1 cup, cooked)`, // rice
        `${ingredientList[1]} (2, chopped)`, // pepper
        `${ingredientList[2]} (2, diced)`, // tomatoes
        `${ingredientList[3]} (1/2, finely chopped)`, // onions
        'Fresh basil (1/4 cup, chopped)',
        'Olive oil (3 tbsp)',
        'Lemon juice (2 tbsp)',
      ],
      instructions: [
        'Cook rice according to package instructions and let it cool.',
        'In a large bowl, combine cooled rice, peppers, tomatoes, and onions.',
        'Add chopped basil to the mixture.',
        'In a small bowl, whisk olive oil and lemon juice to make a dressing.',
        'Pour the dressing over the salad and toss well.',
        'Chill in the fridge for 30 minutes before serving.',
        'Garnish with extra basil if desired.',
      ],
      score: 0,
    },
    {
      title: `${cuisine || 'Global'} Grilled Vegetable and Rice Bowl`,
      description: `A simple ${dietary || 'standard'} bowl featuring grilled peppers and tomatoes, served over rice. A healthy and flavorful ${cuisine || 'global'} dish. (Recipe 4 of 6)`,
      ingredients: [
        `${ingredientList[0]} (1 cup, cooked)`, // rice
        `${ingredientList[1]} (3, sliced)`, // pepper
        `${ingredientList[2]} (2, halved)`, // tomatoes
        `${ingredientList[3]} (1, sliced)`, // onions
        'Balsamic vinegar (2 tbsp)',
        'Olive oil (2 tbsp)',
        'Italian seasoning (1 tsp)',
      ],
      instructions: [
        'Preheat a grill or grill pan to medium heat.',
        'Toss peppers, tomatoes, and onions with olive oil and Italian seasoning.',
        'Grill the vegetables for 5-7 minutes until charred and tender.',
        'Cook rice according to package instructions.',
        'In a bowl, layer the cooked rice and top with grilled vegetables.',
        'Drizzle with balsamic vinegar.',
        'Serve warm with a sprinkle of fresh herbs if desired.',
      ],
      score: 0,
    },
    {
      title: `${cuisine || 'Global'} Pepper and Tomato Soup with Rice`,
      description: `A comforting ${dietary || 'standard'} soup with peppers, tomatoes, and rice, infused with ${cuisine || 'global'} herbs. Perfect for a cozy meal. (Recipe 5 of 6)`,
      ingredients: [
        `${ingredientList[0]} (1/2 cup)`, // rice
        `${ingredientList[1]} (2, diced)`, // pepper
        `${ingredientList[2]} (4, chopped)`, // tomatoes
        `${ingredientList[3]} (1, chopped)`, // onions
        'Vegetable broth (4 cups)',
        'Garlic (3 cloves, minced)',
        'Dried oregano (1 tsp)',
      ],
      instructions: [
        'In a large pot, heat olive oil and sauté onions and garlic until fragrant.',
        'Add peppers and tomatoes, cooking for 5 minutes.',
        'Pour in vegetable broth and add oregano.',
        'Bring to a boil, then reduce heat and simmer for 15 minutes.',
        'Add rice and cook for another 10 minutes until tender.',
        'Season with salt and pepper to taste.',
        'Serve hot with crusty bread.',
      ],
      score: 0,
    },
    {
      title: `${cuisine || 'Global'} Rice and Vegetable Frittata`,
      description: `A ${dietary || 'standard'} frittata packed with rice, peppers, and tomatoes, baked with eggs for a hearty ${cuisine || 'global'} dish. Great for brunch or dinner. (Recipe 6 of 6)`,
      ingredients: [
        `${ingredientList[0]} (1 cup, cooked)`, // rice
        `${ingredientList[1]} (2, diced)`, // pepper
        `${ingredientList[2]} (2, diced)`, // tomatoes
        `${ingredientList[3]} (1, finely chopped)`, // onions
        'Eggs (6, beaten)',
        'Mozzarella cheese (1/2 cup, shredded)',
        'Olive oil (2 tbsp)',
      ],
      instructions: [
        'Preheat oven to 350°F (175°C).',
        'In an oven-safe skillet, heat olive oil and sauté onions, peppers, and tomatoes for 5 minutes.',
        'Add cooked rice and stir to combine.',
        'Pour beaten eggs over the mixture, ensuring even distribution.',
        'Sprinkle mozzarella cheese on top.',
        'Bake in the oven for 15-20 minutes until the eggs are set.',
        'Slice and serve warm.',
      ],
      score: 0,
    },
  ];
};
