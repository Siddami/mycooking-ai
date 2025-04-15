/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const recipes_module_1 = __webpack_require__(6);
let AppModule = class AppModule {
    constructor() {
        console.log('AppModule: Loading environment variables...');
        console.log('AppModule: GEMINI_API_KEY from process.env:', process.env.GEMINI_API_KEY);
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            recipes_module_1.RecipesModule,
        ],
    }),
    tslib_1.__metadata("design:paramtypes", [])
], AppModule);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecipesModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const recipes_service_1 = __webpack_require__(7);
const recipes_controller_1 = __webpack_require__(10);
let RecipesModule = class RecipesModule {
};
exports.RecipesModule = RecipesModule;
exports.RecipesModule = RecipesModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [recipes_controller_1.RecipesController],
        providers: [recipes_service_1.RecipesService],
    })
], RecipesModule);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var RecipesService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecipesService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const generative_ai_1 = __webpack_require__(8);
const mockRecipes_1 = __webpack_require__(9);
let RecipesService = RecipesService_1 = class RecipesService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(RecipesService_1.name);
        this.votes = {};
        this.logger.log('Initializing Google Generative AI...');
        // Try to get the API key from multiple sources
        let apiKey = this.configService.get('GEMINI_API_KEY');
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
        }
        else {
            this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        }
    }
    async generateRecipes(ingredients, cuisine, dietary) {
        this.logger.log(`Generating recipes for ingredients: ${ingredients}, cuisine: ${cuisine}, dietary: ${dietary || 'none'}`);
        if (!this.genAI) {
            this.logger.warn('No Gemini API available. Using mock data.');
            return (0, mockRecipes_1.generateMockRecipes)(ingredients, cuisine, dietary || 'none');
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
            }
            catch (error) {
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
    async updateVote(recipeId, vote) {
        if (!this.votes[recipeId]) {
            this.votes[recipeId] = { up: 0, down: 0 };
        }
        if (vote === 'up') {
            this.votes[recipeId].up += 1;
        }
        else if (vote === 'down') {
            this.votes[recipeId].down += 1;
        }
        this.logger.log(`Updated vote for recipe ${recipeId}: ${JSON.stringify(this.votes[recipeId])}`);
    }
};
exports.RecipesService = RecipesService;
exports.RecipesService = RecipesService = RecipesService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], RecipesService);


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@google/generative-ai");

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateMockRecipes = void 0;
const generateMockRecipes = (ingredients, cuisine, dietary) => {
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
exports.generateMockRecipes = generateMockRecipes;


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecipesController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const recipes_service_1 = __webpack_require__(7);
let RecipesController = class RecipesController {
    constructor(recipesService) {
        this.recipesService = recipesService;
    }
    getWelcome() {
        return 'Welcome to MyCookingAI API';
    }
    async generateRecipes(body) {
        const { ingredients, cuisine, dietary } = body;
        if (!ingredients) {
            throw new common_1.HttpException('Ingredients are required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            console.log('API: Received request with body:', { ingredients, cuisine, dietary });
            const recipes = await this.recipesService.generateRecipes(ingredients, cuisine, dietary);
            console.log('API: Generated recipes:', recipes);
            return recipes;
        }
        catch (error) {
            console.error('API: Error generatingLOGO recipes:', error);
            throw new common_1.HttpException('Failed to generate recipes', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async vote(body) {
        const { recipeId, vote } = body;
        if (!recipeId || !vote || (vote !== 'up' && vote !== 'down')) {
            throw new common_1.HttpException('Invalid vote request', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            await this.recipesService.updateVote(recipeId, vote);
            return { success: true };
        }
        catch (error) {
            console.error('API: Error updating vote:', error);
            throw new common_1.HttpException('Failed to update vote', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.RecipesController = RecipesController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], RecipesController.prototype, "getWelcome", null);
tslib_1.__decorate([
    (0, common_1.Post)('generate-recipes'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RecipesController.prototype, "generateRecipes", null);
tslib_1.__decorate([
    (0, common_1.Post)('vote'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RecipesController.prototype, "vote", null);
exports.RecipesController = RecipesController = tslib_1.__decorate([
    (0, common_1.Controller)('api'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof recipes_service_1.RecipesService !== "undefined" && recipes_service_1.RecipesService) === "function" ? _a : Object])
], RecipesController);


/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("net");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
const dotenv = tslib_1.__importStar(__webpack_require__(11));
const path = tslib_1.__importStar(__webpack_require__(12));
const fs = tslib_1.__importStar(__webpack_require__(13));
const net = tslib_1.__importStar(__webpack_require__(14));
// Try multiple possible locations for the .env file
const possiblePaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '.env'),
    path.resolve(__dirname, '..', '.env'),
    path.resolve(__dirname, '..', '..', '.env'),
    path.resolve(__dirname, '..', '..', '..', '.env'),
    path.resolve(__dirname, '..', '..', '..', '..', '.env'),
    path.resolve(process.cwd(), 'apps', 'cooking-ai-api', '.env'),
];
let envFilePath = null;
for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
        envFilePath = filePath;
        console.log(`Found .env file at: ${filePath}`);
        break;
    }
}
if (envFilePath) {
    const result = dotenv.config({ path: envFilePath });
    if (result.error) {
        console.error(`Error loading .env file: ${result.error.message}`);
    }
    else {
        console.log('Successfully loaded .env file');
    }
}
else {
    console.warn('No .env file found in any of the possible locations');
}
console.log('GEMINI_API_KEY is', process.env.GEMINI_API_KEY ? 'set' : 'not set');
async function findAvailablePort(startPort) {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.listen(startPort, '0.0.0.0');
        server.on('listening', () => {
            const address = server.address();
            if (address && typeof address === 'object') {
                const port = address.port;
                server.close(() => {
                    console.log(`Port ${port} is available`);
                    resolve(port);
                });
            }
        });
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${startPort} is in use, trying ${startPort + 1}`);
                server.close(() => {
                    findAvailablePort(startPort + 1).then(resolve).catch(reject);
                });
            }
            else {
                reject(err);
            }
        });
    });
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*', // Allow all origins for now (temporary for debugging)
        methods: 'GET,POST,OPTIONS',
        allowedHeaders: 'Content-Type,Authorization',
        credentials: true,
        maxAge: 86400,
    });
    const port = await findAvailablePort(3001);
    await app.listen(port, '0.0.0.0');
    console.log(`API is listening on port ${port}`);
}
bootstrap();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map