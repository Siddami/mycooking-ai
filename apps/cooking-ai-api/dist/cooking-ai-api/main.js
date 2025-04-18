/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const recipes_module_1 = __webpack_require__(5);
const config_1 = __webpack_require__(9);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ envFilePath: '.env' }),
            recipes_module_1.RecipesModule,
        ],
    })
], AppModule);


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecipesModule = void 0;
const tslib_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const recipes_service_1 = __webpack_require__(6);
const recipes_controller_1 = __webpack_require__(8);
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
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var RecipesService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecipesService = void 0;
const tslib_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const generative_ai_1 = __webpack_require__(7);
let RecipesService = RecipesService_1 = class RecipesService {
    constructor() {
        this.logger = new common_1.Logger(RecipesService_1.name);
        this.logger.log('Initializing Google Generative AI...');
        const apiKey = process.env.GEMINI_API_KEY || '';
        if (!apiKey) {
            this.logger.error('GEMINI_API_KEY is not set.');
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    async generateRecipe(ingredients, cuisine) {
        this.logger.log(`Generating recipe for ingredients: ${ingredients}, cuisine: ${cuisine}`);
        try {
            const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const prompt = `Generate a detailed ${cuisine} recipe using the following ingredients: ${ingredients}. Include a list of ingredients, cooking instructions, and any tips or variations.`;
            this.logger.log('Sending request to Gemini API...');
            const result = await model.generateContent(prompt);
            this.logger.log('Received response from Gemini API.');
            return result.response.text();
        }
        catch (error) {
            this.logger.error('Failed to generate recipe:', error);
            throw new Error(`Failed to generate recipe: ${error.message}`);
        }
    }
};
exports.RecipesService = RecipesService;
exports.RecipesService = RecipesService = RecipesService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], RecipesService);


/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@google/generative-ai");

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecipesController = void 0;
const tslib_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const recipes_service_1 = __webpack_require__(6);
let RecipesController = class RecipesController {
    constructor(recipesService) {
        this.recipesService = recipesService;
    }
    async generateRecipe(body) {
        const { ingredients, cuisine } = body;
        const recipe = await this.recipesService.generateRecipe(ingredients, cuisine);
        return { recipe };
    }
};
exports.RecipesController = RecipesController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RecipesController.prototype, "generateRecipe", null);
exports.RecipesController = RecipesController = tslib_1.__decorate([
    (0, common_1.Controller)('recipes'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof recipes_service_1.RecipesService !== "undefined" && recipes_service_1.RecipesService) === "function" ? _a : Object])
], RecipesController);


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

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
const core_1 = __webpack_require__(1);
const app_module_1 = __webpack_require__(2);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:4200', 'http://localhost:4201'],
        methods: 'GET,POST',
    });
    await app.listen(3333);
}
bootstrap();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map