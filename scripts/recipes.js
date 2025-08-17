async function fetchData() {
  const statusEl = document.getElementById("status");
  try {
    const response = await fetch("./recipes.json");
    if (!response.ok) {
      throw new Error("Failed to load recipes.json");
    }
    const fileData = await response.json();
    const localData = JSON.parse(localStorage.getItem("recipes")) || [];
    const mergedData = [...fileData, ...localData];

    return mergedData;
  } catch (error) {
    console.error("Fetch error:", error);
    if (statusEl) statusEl.textContent = "Failed to load data.";
    return [];
  }
}

function createCardElement(product) {
  const { id, title, image, readyInMinutes, servings } = product;
  const template = document.getElementById("product-card-template");
  const fragment = template.content.cloneNode(true);

  const imgEl = fragment.querySelector(".product-image");
  imgEl.src = image || "https://placehold.co/312x231?text=No+Image";
  imgEl.alt = title || "Recipe image";

  const titleEl = fragment.querySelector(".product-title");
  titleEl.textContent = title || "Untitled";

  const timeEl = fragment.querySelector(".badge.time");
  if (readyInMinutes != null) {
    timeEl.textContent = `${readyInMinutes} min`;
  } else {
    timeEl.remove();
  }

  const servingsEl = fragment.querySelector(".badge.servings");
  if (servings != null) {
    servingsEl.textContent = `${servings} servings`;
  } else {
    servingsEl.remove();
  }

  const btn = fragment.querySelector(".show-recipe");
  if (btn) {
    if (id == null) {
      btn.disabled = true;
      btn.title = "Missing recipe id";
    } else {
      btn.addEventListener("click", () => {
        const url = `recipe.html?id=${id}`;
        window.location.href = url;
        //encodeURIComponent(id)
      });
    }
  }

  return fragment;
}

function renderProductsPage(pagedItems, page, pageSize, totalItems) {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";

  if (!Array.isArray(pagedItems) || totalItems === 0) {
    grid.innerHTML = "<p>No results.</p>";
    renderPagination(0, 0, 0);
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const item of pagedItems) {
    fragment.appendChild(createCardElement(item));
  }
  grid.appendChild(fragment);

  const totalPages = Math.ceil(totalItems / pageSize);
  renderPagination(page, totalPages, totalItems);
}

function paginate(data, page, pageSize) {
  const start = (page - 1) * pageSize;
  return data.slice(start, start + pageSize);
}

function renderPagination(currentPage, totalPages, totalItems) {
  const container = document.getElementById("pagination");
  container.innerHTML = "";

  if (totalPages <= 1) return;

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage <= 1;
  prevBtn.addEventListener("click", () => goToPage(currentPage - 1));

  const numbers = document.createElement("div");
  numbers.className = "page-numbers";
  for (let i = 1; i <= totalPages; i += 1) {
    const btn = document.createElement("button");
    btn.className = "page-number";
    btn.textContent = String(i);
    if (i === currentPage) {
      btn.classList.add("is-active");
      btn.disabled = true;
    }
    btn.addEventListener("click", () => goToPage(i));
    numbers.appendChild(btn);
  }

  const info = document.createElement("span");
  info.className = "page-info";
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage >= totalPages;
  nextBtn.addEventListener("click", () => goToPage(currentPage + 1));

  container.appendChild(prevBtn);
  container.appendChild(numbers);
  container.appendChild(nextBtn);
  container.appendChild(info);
}

let masterData = [];
let filteredData = [];
let currentPage = 1;
const PAGE_SIZE = 8;

function updateView() {
  const total = filteredData.length;
  const pageItems = paginate(filteredData, currentPage, PAGE_SIZE);
  renderProductsPage(pageItems, currentPage, PAGE_SIZE, total);
}

function goToPage(page) {
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  currentPage = Math.min(Math.max(1, page), totalPages);
  updateView();
}

function setupSearch(allData) {
  const input = document.getElementById("search");
  if (!input) return;
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      filteredData = [...allData];
      currentPage = 1;
      updateView();
      return;
    }
    filteredData = allData.filter((item) => {
      const title = (item.title || "").toLowerCase();
      const diets = Array.isArray(item.diets)
        ? item.diets.join(" ").toLowerCase()
        : "";
      return title.includes(q) || diets.includes(q);
    });
    currentPage = 1;
    updateView();
  });
}

(async function init() {
  const data = await fetchData();
  masterData = Array.isArray(data) ? data : [];
  filteredData = [...masterData];
  updateView();
  setupSearch(masterData);
})();
