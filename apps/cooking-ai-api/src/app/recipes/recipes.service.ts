import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateMockRecipes } from '../../utils/mockRecipes';

export interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  score: number;
}

@Injectable()
export class RecipesService {
  private readonly genAI: GoogleGenerativeAI | null;
  private readonly logger = new Logger(RecipesService.name);
  private votes: { [recipeId: number]: { up: number; down: number } } = {};

  constructor(private configService: ConfigService) {
    this.logger.log('Initializing Google Generative AI...');
    
    // Try to get the API key from multiple sources
    let apiKey = this.configService.get<string>('GEMINI_API_KEY');
    
    if (!apiKey) {
      apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        this.logger.log('Using API key from process.env directly');
      }
    }
    
    if (!apiKey) {
      this.logger.warn('WARNING: Using hardcoded API key as fallback. Not recommended for production!');
      apiKey = 'AIzaSyBugUp9KyazmQ74XqGrntlszlzatg6ibFA';
    }
    
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY is not set. Falling back to mock data.');
      this.genAI = null;
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async generateRecipes(ingredients: string, cuisine: string, dietary?: string): Promise<Recipe[]> {
    this.logger.log(`Generating recipes for ingredients: ${ingredients}, cuisine: ${cuisine}, dietary: ${dietary || 'none'}`);

    if (!this.genAI) {
      this.logger.warn('No Gemini API available. Using mock data.');
      return generateMockRecipes(ingredients, cuisine, dietary || 'none');
    }

    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Dietary prompt adjustment
    const dietaryPrompt = dietary ? `, adhering to ${dietary} dietary preferences` : '';
    const promptBase = `
      Generate a detailed ${cuisine} recipe using the following ingredients: ${ingredients}${dietaryPrompt}.
      Ensure the recipe is unique in style and preparation method (e.g., avoid generating multiple risottos or similar dishes).
      Provide the following in a structured format:
      - Title (prefix with a single #, e.g., # Recipe Title)
      - Description (2-3 sentences under the title)
      - Ingredients (list each ingredient with quantities under a ## Ingredients heading)
      - Instructions (list step-by-step under a ## Instructions heading)
      - Tips or variations (optional, under a ## Tips heading)
    `;

    // Generate 6 recipes
    const recipesPromises = Array.from({ length: 6 }, async (_, index) => {
      try {
        const prompt = `${promptBase} Recipe ${index + 1} of 6.`;
        this.logger.log(`Sending request ${index + 1}/6 to Gemini API...`);
        const result = await model.generateContent(prompt);
        this.logger.log(`Received response ${index + 1}/6 from Gemini API.`);

        const text = result.response.text();
        // Parse the response text
        const titleMatch = text.match(/^# (.+)/m);
        const title = titleMatch ? titleMatch[1].trim() : `Untitled Recipe ${index + 1}`;

        const descriptionMatch = text.match(/^# .+\n([\s\S]+?)(?=\n## )/m);
        const description = descriptionMatch
          ? descriptionMatch[1].trim().slice(0, 100) + '...'
          : 'No description available.';

        const ingredientsMatch = text.match(/## Ingredients\n([\s\S]+?)(?=\n## )/m);
        const ingredients = ingredientsMatch
          ? ingredientsMatch[1]
              .split('\n')
              .map(line => line.trim())
              .filter(line => line && !line.startsWith('##'))
          : [];

        const instructionsMatch = text.match(/## Instructions\n([\s\S]+?)(?=\n## |$)/m);
        const instructions = instructionsMatch
          ? instructionsMatch[1]
              .split('\n')
              .map(line => line.trim())
              .filter(line => line && !line.startsWith('##'))
          : [];

        return {
          title,
          description: `${description} (Recipe ${index + 1} of 6)`,
          ingredients,
          instructions,
          score: (this.votes[index]?.up || 0) - (this.votes[index]?.down || 0),
        };
      } catch (error) {
        this.logger.error(`Failed to generate recipe ${index + 1}:`, error);
        return {
          title: `Error Recipe ${index + 1}`,
          description: 'Failed to generate recipe.',
          ingredients: [],
          instructions: [],
          score: 0,
        };
      }
    });

    const recipes = await Promise.all(recipesPromises);
    // Sort recipes by score (descending)
    recipes.sort((a, b) => b.score - a.score);
    return recipes;
  }

  async updateVote(recipeId: number, vote: 'up' | 'down') {
    if (!this.votes[recipeId]) {
      this.votes[recipeId] = { up: 0, down: 0 };
    }
    if (vote === 'up') {
      this.votes[recipeId].up += 1;
    } else if (vote === 'down') {
      this.votes[recipeId].down += 1;
    }
    this.logger.log(`Updated vote for recipe ${recipeId}: ${JSON.stringify(this.votes[recipeId])}`);
  }
}
