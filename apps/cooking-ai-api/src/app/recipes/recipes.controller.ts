import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RecipesService } from './recipes.service';

@Controller('api')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  getWelcome() {
    return 'Welcome to MyCookingAI API';
  }

  @Post('generate-recipes')
  async generateRecipes(
    @Body() body: { ingredients: string; cuisine: string; dietary?: string }
  ) {
    const { ingredients, cuisine, dietary } = body;

    if (!ingredients) {
      throw new HttpException('Ingredients are required', HttpStatus.BAD_REQUEST);
    }

    try {
      console.log('API: Received request with body:', { ingredients, cuisine, dietary });
      const recipes = await this.recipesService.generateRecipes(ingredients, cuisine, dietary);
      console.log('API: Generated recipes:', recipes);
      return recipes;
    } catch (error) {
      console.error('API: Error generatingLOGO recipes:', error);
      throw new HttpException('Failed to generate recipes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('vote')
  async vote(
    @Body() body: { recipeId: number; vote: 'up' | 'down' }
  ) {
    const { recipeId, vote } = body;

    if (!recipeId || !vote || (vote !== 'up' && vote !== 'down')) {
      throw new HttpException('Invalid vote request', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.recipesService.updateVote(recipeId, vote);
      return { success: true };
    } catch (error) {
      console.error('API: Error updating vote:', error);
      throw new HttpException('Failed to update vote', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
