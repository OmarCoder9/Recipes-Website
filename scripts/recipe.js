async function fetchRecipeData() {
  try {
    const response = await fetch("./recipes.json");
    if (!response.ok) {
      throw new Error("Failed to load recipes");
    }
    // return await response.json();
    const localData = JSON.parse(localStorage.getItem("recipes")) || [];
    const fileData = await response.json();
    const mergedData = [...fileData, ...localData];

    return mergedData;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return null;
  }
}

function findRecipeById(recipes, id) {
  return recipes.find((recipe) => recipe.id === parseInt(id));
}

function displayRecipe(recipe) {
  // Set image
  const imageEl = document.getElementById("recipe-image");
  imageEl.src =
    recipe.image || "https://via.placeholder.com/400x300?text=No+Image";
  imageEl.alt = recipe.title;

  // Set title
  document.getElementById("recipe-title").textContent = recipe.title;

  // Set stats
  if (recipe.readyInMinutes) {
    document.getElementById(
      "ready-time"
    ).textContent = `⏱ ${recipe.readyInMinutes} min`;
  }
  if (recipe.servings) {
    document.getElementById(
      "servings"
    ).textContent = `🍽 ${recipe.servings} servings`;
  }
  if (recipe.healthScore) {
    document.getElementById(
      "health-score"
    ).textContent = `❤️ ${recipe.healthScore} health`;
  }
  if (recipe.aggregateLikes) {
    document.getElementById(
      "likes"
    ).textContent = `👍 ${recipe.aggregateLikes} likes`;
  }

  // Set diet tags
  const dietTagsEl = document.getElementById("diet-tags");
  if (recipe.diets && recipe.diets.length > 0) {
    dietTagsEl.innerHTML = recipe.diets
      .map((diet) => `<span class="diet-tag">${diet}</span>`)
      .join("");
  }

  // Set dish types
  const dishTypesEl = document.getElementById("dish-types");
  if (recipe.dishTypes && recipe.dishTypes.length > 0) {
    dishTypesEl.innerHTML = recipe.dishTypes
      .map((type) => `<span class="dish-type">${type}</span>`)
      .join("");
  }

  // Set summary (strip HTML tags)
  const summaryEl = document.getElementById("recipe-summary-text");
  if (recipe.summary) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = recipe.summary;
    summaryEl.textContent = tempDiv.textContent || tempDiv.innerText;
  } else {
    summaryEl.textContent = "No summary available.";
  }

  // Show content
  document.getElementById("recipe-content").style.display = "block";
}

async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");

  if (!recipeId) {
    document.getElementById("error").style.display = "block";
    document.getElementById("loading").style.display = "none";
    return;
  }

  const recipes = await fetchRecipeData();
  if (!recipes) {
    document.getElementById("error").style.display = "block";
    document.getElementById("loading").style.display = "none";
    return;
  }

  const recipe = findRecipeById(recipes, recipeId);
  if (!recipe) {
    document.getElementById("error").style.display = "block";
    document.getElementById("loading").style.display = "none";
    return;
  }

  document.getElementById("loading").style.display = "none";
  displayRecipe(recipe);
}

// Initialize when page loads
init();
