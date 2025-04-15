import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RecipesModule,
  ],
})
export class AppModule {
  constructor() {
    console.log('AppModule: Loading environment variables...');
    console.log('AppModule: GEMINI_API_KEY from process.env:', process.env.GEMINI_API_KEY);
  }
}