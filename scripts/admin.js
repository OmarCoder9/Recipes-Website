let recipes = [];
let userRecipes = [];
let editIndex = null;

// Load recipes from JSON + localStorage
async function loadRecipes() {
  try {
    const res = await fetch("recipes.json");
    const fileData = await res.json();

    userRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    recipes = [...fileData, ...userRecipes];
    renderTable();
  } catch (err) {
    console.error("Error loading recipes:", err);
  }
}

document.getElementById("searchInput").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const filtered = recipes.filter((r) => r.title.toLowerCase().includes(query));
  renderTable(filtered);
});

// Render recipes table
function renderTable(data = recipes) {
  const tableBody = document.getElementById("recipeTable");
  tableBody.innerHTML = "";
  data.forEach((r, index) => {
    const originalIndex = recipes.indexOf(r);

    tableBody.innerHTML += `
      <tr>
        <td><img src="${r.image}" alt="${r.title}" loading="lazy"></td>
        <td>${r.title}</td>
        <td>${r.readyInMinutes} min</td>
        <td>${r.servings}</td>
        <td>${r.vegetarian ? "✅" : "❌"}</td>
        <td>${r.vegan ? "✅" : "❌"}</td>
        <td>${r.healthScore || "-"}</td>
        <td>${r.aggregateLikes || 0}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editRecipe(${originalIndex})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteRecipe(${originalIndex})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function getFormData() {
  return {
    title: document.getElementById("title").value.trim(),
    image: document.getElementById("image").value.trim(),
    id: parseInt(document.getElementById("id").value),
    readyInMinutes: parseInt(document.getElementById("readyInMinutes").value),
    servings: parseInt(document.getElementById("servings").value),
    vegetarian: document.getElementById("vegetarian").value === "true",
    vegan: document.getElementById("vegan").value === "true",
    diets: document
      .getElementById("diets")
      .value.split(",")
      .map((d) => d.trim())
      .filter((d) => d),
    aggregateLikes: parseInt(document.getElementById("aggregateLikes").value),
    healthScore: parseInt(document.getElementById("healthScore").value),
    summary: document.getElementById("summary").value.trim(),
    dishTypes: document
      .getElementById("dishTypes")
      .value.split(",")
      .map((d) => d.trim())
      .filter((d) => d),
  };
}

// Save (Add/Edit) recipe
document.getElementById("saveBtn").addEventListener("click", () => {
  const data = getFormData();
  if (!data.title || !data.image) {
    alert("Title and Image are required!");
    return;
  }

  if (editIndex === null) {
    userRecipes.push(data);
    recipes.push(data);
  } else {
    if (editIndex >= recipes.length - userRecipes.length) {
      const userIndex = editIndex - (recipes.length - userRecipes.length);
      userRecipes[userIndex] = data;
    }
    recipes[editIndex] = data;
    editIndex = null;
    document.getElementById("formTitle").textContent = "Add New Recipe";
    document.getElementById("cancelEdit").classList.add("d-none");
  }
  localStorage.setItem("recipes", JSON.stringify(userRecipes));
  renderTable();
  document
    .querySelectorAll("input:not(#searchInput), textarea, select")
    .forEach((input) => (input.value = ""));
});

function editRecipe(index) {
  const r = recipes[index];
  document.getElementById("title").value = r.title;
  document.getElementById("image").value = r.image;
  document.getElementById("id").value = r.id;
  document.getElementById("readyInMinutes").value = r.readyInMinutes;
  document.getElementById("servings").value = r.servings;
  document.getElementById("vegetarian").value = r.vegetarian;
  document.getElementById("vegan").value = r.vegan;
  document.getElementById("diets").value = r.diets.join(", ");
  document.getElementById("aggregateLikes").value = r.aggregateLikes;
  document.getElementById("healthScore").value = r.healthScore;
  document.getElementById("summary").value = r.summary;
  document.getElementById("dishTypes").value = r.dishTypes.join(", ");
  editIndex = index;
  document.getElementById("formTitle").textContent = "Edit Recipe";
  document.getElementById("cancelEdit").classList.remove("d-none");
}

document.getElementById("cancelEdit").addEventListener("click", () => {
  editIndex = null;
  document.getElementById("formTitle").textContent = "Add New Recipe";
  document
    .querySelectorAll("input:not(#searchInput), textarea, select")
    .forEach((input) => (input.value = ""));
  document.getElementById("cancelEdit").classList.add("d-none");
});

function deleteRecipe(index) {
  if (!confirm("Are you sure you want to delete this recipe?")) return;
  if (index >= recipes.length - userRecipes.length) {
    const userIndex = index - (recipes.length - userRecipes.length);
    userRecipes.splice(userIndex, 1);
  }
  recipes.splice(index, 1);

  localStorage.setItem("recipes", JSON.stringify(userRecipes));
  renderTable();
}

loadRecipes();
