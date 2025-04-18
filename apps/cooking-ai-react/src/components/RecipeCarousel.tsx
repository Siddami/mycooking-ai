import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Recipe {
  title: string;
  description: string;
  score: number;
  ingredients?: string[];
  instructions?: string[];
}

interface RecipeCarouselProps {
  recipes: Recipe[];
  onRecipeClick: (recipe: Recipe) => void;
}

const RecipeCarousel: React.FC<RecipeCarouselProps> = ({ recipes, onRecipeClick }) => {
  const settings = {
    dots: true,
    infinite: recipes.length > 1,
    speed: 500,
    slidesToShow: Math.min(recipes.length, 3),
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(recipes.length, 2),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '10px',
        },
      },
    ],
  };

  const handleVote = (index: number, vote: 'up' | 'down') => {
      // Emit a vote event that Angular can listen for
      (window.eventBus as any)?.emit('submitVote', { recipeId: index + 1, vote });
  };

  return (
    <Slider {...settings}>
      {recipes.map((recipe, index) => (
        <div key={index} className="p-4">
          <div
            className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition"
            onClick={() => onRecipeClick(recipe)}
          >
            <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
            <p className="text-gray-700">{recipe.description}</p>
            <p className="text-sm text-gray-500 mt-2">Score: {recipe.score}</p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering onRecipeClick
                  handleVote(index, 'up');
                }}
                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition"
              >
                Upvote
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering onRecipeClick
                  handleVote(index, 'down');
                }}
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
              >
                Downvote
              </button>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default RecipeCarousel;