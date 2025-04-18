interface Recipe {
  title: string;
  description: string;
  score: number;
  ingredients?: string[];
  instructions?: string[];
}

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">{recipe.title}</h2>
        <p className="text-gray-700 mb-4">{recipe.description}</p>
        <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
        <ul className="list-disc pl-5 mb-4">
          {recipe.ingredients?.map((ingredient, idx) => (
            <li key={idx} className="text-gray-700">{ingredient}</li>
          ))}
        </ul>
        <h3 className="text-lg font-semibold mb-2">Instructions</h3>
        <ol className="list-decimal pl-5 mb-4">
          {recipe.instructions?.map((step, idx) => (
            <li key={idx} className="text-gray-700">{step}</li>
          ))}
        </ol>
        <button
          onClick={onClose}
          className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RecipeModal;
