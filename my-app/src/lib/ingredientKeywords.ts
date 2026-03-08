export type IngredientOption = {
  id: string;
  label: string;
  keywords: string[];
};

export const INGREDIENT_OPTIONS: IngredientOption[] = [
  // Proteins
  {
    id: "chicken",
    label: "Chicken",
    keywords: ["chicken", "chicken breast", "chicken thigh", "chicken wings", "rotisserie chicken", "ground chicken"],
  },
  {
    id: "beef",
    label: "Beef",
    keywords: ["beef", "ground beef", "minced beef", "steak", "sirloin", "chuck roast"],
  },
  {
    id: "pork",
    label: "Pork",
    keywords: ["pork", "pork chop", "pork loin", "bacon", "ham", "prosciutto", "pancetta"],
  },
  {
    id: "fish",
    label: "Fish",
    keywords: ["fish", "white fish", "cod", "tilapia", "salmon", "tuna", "trout", "haddock"],
  },
  {
    id: "shrimp",
    label: "Shrimp",
    keywords: ["shrimp", "prawn", "prawns"],
  },
  {
    id: "egg",
    label: "Eggs",
    keywords: ["egg", "eggs"],
  },
  {
    id: "turkey",
    label: "Turkey",
    keywords: ["turkey", "ground turkey", "turkey breast"],
  },
  {
    id: "lamb",
    label: "Lamb",
    keywords: ["lamb", "ground lamb", "lamb chop"],
  },
  {
    id: "tofu",
    label: "Tofu",
    keywords: ["tofu", "firm tofu", "silken tofu"],
  },
  {
    id: "beans",
    label: "Beans",
    keywords: ["beans", "black beans", "kidney beans", "pinto beans", "white beans", "cannellini"],
  },
  {
    id: "lentils",
    label: "Lentils",
    keywords: ["lentil", "lentils", "red lentils", "green lentils"],
  },

  // Carbs / Staples
  {
    id: "rice",
    label: "Rice",
    keywords: ["rice", "white rice", "brown rice", "jasmine rice", "basmati rice"],
  },
  {
    id: "pasta",
    label: "Pasta",
    keywords: ["pasta", "spaghetti", "penne", "macaroni", "noodles"],
  },
  {
    id: "potato",
    label: "Potato",
    keywords: ["potato", "potatoes", "russet potato", "sweet potato"],
  },
  {
    id: "bread",
    label: "Bread",
    keywords: ["bread", "buns", "rolls", "baguette", "tortilla", "flatbread"],
  },
  {
    id: "flour",
    label: "Flour",
    keywords: ["flour", "all-purpose flour", "ap flour", "plain flour"],
  },
  {
    id: "quinoa",
    label: "Quinoa",
    keywords: ["quinoa"],
  },
  {
    id: "oats",
    label: "Oats",
    keywords: ["oats", "oatmeal", "rolled oats"],
  },
  {
    id: "couscous",
    label: "Couscous",
    keywords: ["couscous"],
  },

  // Vegetables
  {
    id: "tomato",
    label: "Tomato",
    keywords: ["tomato", "tomatoes", "cherry tomato", "grape tomato"],
  },
  {
    id: "onion",
    label: "Onion",
    keywords: ["onion", "onions", "red onion", "yellow onion", "white onion"],
  },
  {
    id: "garlic",
    label: "Garlic",
    keywords: ["garlic", "garlic clove", "garlic cloves"],
  },
  {
    id: "bell_pepper",
    label: "Bell pepper",
    keywords: ["bell pepper", "bell peppers", "red pepper", "green pepper", "yellow pepper", "capsicum"],
  },
  {
    id: "carrot",
    label: "Carrot",
    keywords: ["carrot", "carrots", "baby carrots"],
  },
  {
    id: "broccoli",
    label: "Broccoli",
    keywords: ["broccoli", "broccoli florets"],
  },
  {
    id: "spinach",
    label: "Spinach",
    keywords: ["spinach", "baby spinach"],
  },
  {
    id: "mushroom",
    label: "Mushroom",
    keywords: ["mushroom", "mushrooms", "button mushroom", "cremini"],
  },
  {
    id: "lettuce",
    label: "Lettuce",
    keywords: ["lettuce", "romaine", "iceberg", "salad greens"],
  },
  {
    id: "cucumber",
    label: "Cucumber",
    keywords: ["cucumber", "cucumbers"],
  },
  {
    id: "zucchini",
    label: "Zucchini",
    keywords: ["zucchini", "courgette"],
  },
  {
    id: "eggplant",
    label: "Eggplant",
    keywords: ["eggplant", "aubergine"],
  },
  {
    id: "corn",
    label: "Corn",
    keywords: ["corn", "sweet corn", "corn kernels"],
  },
  {
    id: "peas",
    label: "Peas",
    keywords: ["peas", "green peas", "frozen peas"],
  },

  // Fruit
  {
    id: "apple",
    label: "Apple",
    keywords: ["apple", "apples"],
  },
  {
    id: "banana",
    label: "Banana",
    keywords: ["banana", "bananas"],
  },
  {
    id: "lemon",
    label: "Lemon",
    keywords: ["lemon", "lemons", "lemon juice", "lemon zest"],
  },
  {
    id: "lime",
    label: "Lime",
    keywords: ["lime", "limes", "lime juice", "lime zest"],
  },
  {
    id: "orange",
    label: "Orange",
    keywords: ["orange", "oranges", "orange juice", "orange zest"],
  },
  {
    id: "berries",
    label: "Berries",
    keywords: ["berries", "strawberry", "strawberries", "blueberries", "raspberries", "blackberries"],
  },

  // Dairy
  {
    id: "milk",
    label: "Milk",
    keywords: ["milk", "whole milk", "skim milk"],
  },
  {
    id: "butter",
    label: "Butter",
    keywords: ["butter", "unsalted butter", "salted butter"],
  },
  {
    id: "cheese",
    label: "Cheese",
    keywords: ["cheese", "cheddar", "mozzarella", "parmesan", "feta", "goat cheese"],
  },
  {
    id: "yogurt",
    label: "Yogurt",
    keywords: ["yogurt", "greek yogurt", "plain yogurt"],
  },

  // Pantry / Seasoning
  {
    id: "olive_oil",
    label: "Olive oil",
    keywords: ["olive oil", "extra virgin olive oil", "ev olive oil"],
  },
  {
    id: "vegetable_oil",
    label: "Vegetable oil",
    keywords: ["vegetable oil", "canola oil", "sunflower oil"],
  },
  {
    id: "salt",
    label: "Salt",
    keywords: ["salt", "sea salt", "table salt", "kosher salt"],
  },
  {
    id: "pepper",
    label: "Pepper",
    keywords: ["pepper", "black pepper"],
  },
  {
    id: "sugar",
    label: "Sugar",
    keywords: ["sugar", "granulated sugar", "white sugar"],
  },
  {
    id: "brown_sugar",
    label: "Brown sugar",
    keywords: ["brown sugar", "light brown sugar", "dark brown sugar"],
  },
  {
    id: "soy_sauce",
    label: "Soy sauce",
    keywords: ["soy sauce", "soya sauce"],
  },
  {
    id: "vinegar",
    label: "Vinegar",
    keywords: ["vinegar", "white vinegar", "apple cider vinegar", "balsamic"],
  },

  // Herbs
  {
    id: "basil",
    label: "Basil",
    keywords: ["basil", "fresh basil"],
  },
  {
    id: "oregano",
    label: "Oregano",
    keywords: ["oregano", "dried oregano"],
  },
  {
    id: "parsley",
    label: "Parsley",
    keywords: ["parsley", "fresh parsley"],
  },
  {
    id: "cilantro",
    label: "Cilantro",
    keywords: ["cilantro", "coriander leaves"],
  },
];

export function searchIngredientOptions(query: string, excludeIds: string[] = []): IngredientOption[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const exclude = new Set(excludeIds);

  return INGREDIENT_OPTIONS.filter((option) => {
    if (exclude.has(option.id)) return false;

    const inLabel = option.label.toLowerCase().includes(normalized);
    const inKeywords = option.keywords.some((keyword) => keyword.toLowerCase().includes(normalized));

    return inLabel || inKeywords;
  }).slice(0, 10);
}

