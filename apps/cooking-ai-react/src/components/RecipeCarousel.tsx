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
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default RecipeCarousel;
