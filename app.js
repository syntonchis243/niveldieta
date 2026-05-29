const DEFAULT_FOODS = [
  { id: "pollo-pechuga", name: "Pechuga de pollo", category: "Proteinas", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: "huevo", name: "Huevo entero", category: "Proteinas", calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5 },
  { id: "atun", name: "Atun al natural", category: "Proteinas", calories: 116, protein: 26, carbs: 0, fat: 1 },
  { id: "ternera", name: "Ternera magra", category: "Proteinas", calories: 176, protein: 26, carbs: 0, fat: 7.5 },
  { id: "tofu", name: "Tofu firme", category: "Proteinas", calories: 144, protein: 15.7, carbs: 3.5, fat: 8.7 },
  { id: "arroz", name: "Arroz cocido", category: "Carbohidratos", calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3 },
  { id: "pasta", name: "Pasta cocida", category: "Carbohidratos", calories: 158, protein: 5.8, carbs: 30.9, fat: 0.9 },
  { id: "avena", name: "Avena", category: "Carbohidratos", calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
  { id: "patata", name: "Patata cocida", category: "Carbohidratos", calories: 87, protein: 1.9, carbs: 20.1, fat: 0.1 },
  { id: "pan-integral", name: "Pan integral", category: "Carbohidratos", calories: 247, protein: 13, carbs: 41, fat: 4.2 },
  { id: "aceite-oliva", name: "Aceite de oliva", category: "Grasas saludables", calories: 884, protein: 0, carbs: 0, fat: 100 },
  { id: "aguacate", name: "Aguacate", category: "Grasas saludables", calories: 160, protein: 2, carbs: 8.5, fat: 14.7 },
  { id: "almendras", name: "Almendras", category: "Grasas saludables", calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9 },
  { id: "yogur-griego", name: "Yogur griego natural", category: "Lacteos", calories: 97, protein: 9, carbs: 3.9, fat: 5 },
  { id: "leche", name: "Leche semidesnatada", category: "Lacteos", calories: 47, protein: 3.4, carbs: 4.8, fat: 1.6 },
  { id: "platano", name: "Platano", category: "Frutas", calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
  { id: "manzana", name: "Manzana", category: "Frutas", calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2 },
  { id: "brocoli", name: "Brocoli", category: "Verduras", calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4 },
  { id: "espinacas", name: "Espinacas", category: "Verduras", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { id: "salmon", name: "Salmon", category: "Proteinas", calories: 208, protein: 20.4, carbs: 0, fat: 13.4 }
];

const DEFAULT_GOALS = {
  calories: 2200,
  protein: 150,
  carbs: 220,
  fat: 70
};

const MEALS = ["Desayuno", "Comida", "Cena", "Snack"];
const STORAGE = {
  foods: "niveldieta.foods",
  entries: "niveldieta.entries",
  goals: "niveldieta.goals",
  date: "niveldieta.date"
};

const state = {
  foods: readStorage(STORAGE.foods, DEFAULT_FOODS),
  entries: readStorage(STORAGE.entries, {}),
  goals: readStorage(STORAGE.goals, DEFAULT_GOALS),
  date: readStorage(STORAGE.date, todayKey()),
  meal: "Desayuno"
};

const elements = {
  entryDate: document.querySelector("#entryDate"),
  prevDay: document.querySelector("#prevDay"),
  nextDay: document.querySelector("#nextDay"),
  mealTabs: document.querySelector("#mealTabs"),
  foodSelect: document.querySelector("#foodSelect"),
  gramsInput: document.querySelector("#gramsInput"),
  addEntryForm: document.querySelector("#addEntryForm"),
  selectedFoodName: document.querySelector("#selectedFoodName"),
  selectedFoodMacros: document.querySelector("#selectedFoodMacros"),
  customFoodForm: document.querySelector("#customFoodForm"),
  customFoodDetails: document.querySelector("#customFoodDetails"),
  customName: document.querySelector("#customName"),
  customCategory: document.querySelector("#customCategory"),
  customCalories: document.querySelector("#customCalories"),
  customProtein: document.querySelector("#customProtein"),
  customCarbs: document.querySelector("#customCarbs"),
  customFat: document.querySelector("#customFat"),
  calorieTotal: document.querySelector("#calorieTotal"),
  caloriePercent: document.querySelector("#caloriePercent"),
  calorieRing: document.querySelector("#calorieRing"),
  remainingText: document.querySelector("#remainingText"),
  proteinTotal: document.querySelector("#proteinTotal"),
  carbsTotal: document.querySelector("#carbsTotal"),
  fatTotal: document.querySelector("#fatTotal"),
  proteinBar: document.querySelector("#proteinBar"),
  carbsBar: document.querySelector("#carbsBar"),
  fatBar: document.querySelector("#fatBar"),
  proteinGoal: document.querySelector("#proteinGoal"),
  carbsGoal: document.querySelector("#carbsGoal"),
  fatGoal: document.querySelector("#fatGoal"),
  entryList: document.querySelector("#entryList"),
  clearDay: document.querySelector("#clearDay"),
  goalForm: document.querySelector("#goalForm"),
  goalCalories: document.querySelector("#goalCalories"),
  goalProtein: document.querySelector("#goalProtein"),
  goalCarbs: document.querySelector("#goalCarbs"),
  goalFat: document.querySelector("#goalFat"),
  toast: document.querySelector("#toast")
};

init();

function init() {
  elements.entryDate.value = state.date;
  syncGoalForm();
  renderFoodOptions();
  bindEvents();
  render();
}

function bindEvents() {
  elements.entryDate.addEventListener("change", () => {
    state.date = elements.entryDate.value || todayKey();
    writeStorage(STORAGE.date, state.date);
    render();
  });

  elements.prevDay.addEventListener("click", () => shiftDate(-1));
  elements.nextDay.addEventListener("click", () => shiftDate(1));

  elements.mealTabs.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-meal]");
    if (!tab) return;
    state.meal = tab.dataset.meal;
    renderMealTabs();
  });

  elements.foodSelect.addEventListener("change", renderSelectedFood);

  elements.addEntryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const food = getSelectedFood();
    const grams = Number(elements.gramsInput.value);
    if (!food || !Number.isFinite(grams) || grams <= 0) return;

    const entry = {
      id: createId("entry"),
      foodId: food.id,
      name: food.name,
      meal: state.meal,
      grams,
      createdAt: new Date().toISOString()
    };

    const dayEntries = getDayEntries();
    state.entries[state.date] = [...dayEntries, entry];
    persistEntries();
    render();
    showToast(`${food.name} añadido a ${state.meal.toLowerCase()}`);
  });

  elements.customFoodForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const food = {
      id: createId("custom"),
      name: elements.customName.value.trim(),
      category: elements.customCategory.value.trim() || "Mis alimentos",
      calories: readNumber(elements.customCalories.value),
      protein: readNumber(elements.customProtein.value),
      carbs: readNumber(elements.customCarbs.value),
      fat: readNumber(elements.customFat.value),
      custom: true
    };

    if (!food.name) return;
    state.foods = [...state.foods, food].sort((a, b) => a.name.localeCompare(b.name, "es"));
    writeStorage(STORAGE.foods, state.foods);
    elements.customFoodForm.reset();
    elements.customCategory.value = "Mis alimentos";
    elements.customFoodDetails.open = false;
    renderFoodOptions(food.id);
    render();
    showToast("Alimento guardado en tu biblioteca");
  });

  elements.entryList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-entry]");
    if (!button) return;
    state.entries[state.date] = getDayEntries().filter((entry) => entry.id !== button.dataset.deleteEntry);
    persistEntries();
    render();
    showToast("Entrada eliminada");
  });

  elements.clearDay.addEventListener("click", () => {
    if (!getDayEntries().length) return;
    state.entries[state.date] = [];
    persistEntries();
    render();
    showToast("Dia limpiado");
  });

  elements.goalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.goals = {
      calories: readNumber(elements.goalCalories.value),
      protein: readNumber(elements.goalProtein.value),
      carbs: readNumber(elements.goalCarbs.value),
      fat: readNumber(elements.goalFat.value)
    };
    writeStorage(STORAGE.goals, state.goals);
    render();
    showToast("Objetivos actualizados");
  });
}

function render() {
  renderMealTabs();
  renderSelectedFood();
  renderSummary();
  renderEntries();
}

function renderFoodOptions(selectedId = elements.foodSelect.value) {
  const groups = state.foods.reduce((acc, food) => {
    acc[food.category] ||= [];
    acc[food.category].push(food);
    return acc;
  }, {});

  elements.foodSelect.replaceChildren();
  Object.keys(groups)
    .sort((a, b) => a.localeCompare(b, "es"))
    .forEach((category) => {
      const optgroup = document.createElement("optgroup");
      optgroup.label = category;
      groups[category]
        .sort((a, b) => a.name.localeCompare(b.name, "es"))
        .forEach((food) => {
          const option = document.createElement("option");
          option.value = food.id;
          option.textContent = food.name;
          optgroup.append(option);
        });
      elements.foodSelect.append(optgroup);
    });

  if (selectedId && state.foods.some((food) => food.id === selectedId)) {
    elements.foodSelect.value = selectedId;
  }
}

function renderMealTabs() {
  document.querySelectorAll("[data-meal]").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.meal === state.meal);
  });
}

function renderSelectedFood() {
  const food = getSelectedFood();
  if (!food) return;
  elements.selectedFoodName.textContent = food.name;
  elements.selectedFoodMacros.textContent = `${round(food.calories)} kcal · P ${round(food.protein)}g · C ${round(food.carbs)}g · G ${round(food.fat)}g por 100g`;
}

function renderSummary() {
  const totals = getTotals(getDayEntries());
  const calorieRatio = safeRatio(totals.calories, state.goals.calories);
  const remaining = Math.round(state.goals.calories - totals.calories);

  elements.calorieTotal.textContent = round(totals.calories);
  elements.caloriePercent.textContent = `${Math.round(calorieRatio * 100)}%`;
  elements.remainingText.textContent = remaining >= 0 ? `${remaining} kcal restantes` : `${Math.abs(remaining)} kcal por encima`;

  const ringLength = 339.29;
  elements.calorieRing.style.strokeDashoffset = ringLength - ringLength * Math.min(calorieRatio, 1);
  elements.calorieRing.style.stroke = calorieRatio > 1 ? "var(--coral)" : "var(--green)";

  updateMacro("protein", totals.protein, state.goals.protein);
  updateMacro("carbs", totals.carbs, state.goals.carbs);
  updateMacro("fat", totals.fat, state.goals.fat);
}

function updateMacro(key, value, goal) {
  elements[`${key}Total`].textContent = round(value);
  elements[`${key}Bar`].style.width = `${Math.min(safeRatio(value, goal) * 100, 100)}%`;
  elements[`${key}Goal`].textContent = `${round(value)} / ${round(goal)}g`;
}

function renderEntries() {
  const dayEntries = getDayEntries();
  elements.entryList.replaceChildren();

  if (!dayEntries.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Todavia no hay comidas registradas para esta fecha.";
    elements.entryList.append(empty);
    return;
  }

  MEALS.forEach((meal) => {
    const entries = dayEntries.filter((entry) => entry.meal === meal);
    if (!entries.length) return;

    const group = document.createElement("div");
    group.className = "meal-group";

    const mealTotals = getTotals(entries);
    const title = document.createElement("div");
    title.className = "meal-title";
    title.innerHTML = `<span>${meal}</span><span>${round(mealTotals.calories)} kcal</span>`;
    group.append(title);

    entries.forEach((entry) => group.append(createEntryItem(entry)));
    elements.entryList.append(group);
  });
}

function createEntryItem(entry) {
  const food = state.foods.find((item) => item.id === entry.foodId);
  const macros = calculateMacros(food || entry, entry.grams);
  const item = document.createElement("article");
  item.className = "entry-item";

  const main = document.createElement("div");
  main.className = "entry-main";

  const name = document.createElement("strong");
  name.textContent = entry.name;

  const details = document.createElement("span");
  details.textContent = `${round(entry.grams)}g · ${round(macros.calories)} kcal · P ${round(macros.protein)}g · C ${round(macros.carbs)}g · G ${round(macros.fat)}g`;

  const button = document.createElement("button");
  button.className = "delete-entry";
  button.type = "button";
  button.title = "Eliminar entrada";
  button.ariaLabel = "Eliminar entrada";
  button.dataset.deleteEntry = entry.id;
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>';

  main.append(name, details);
  item.append(main, button);
  return item;
}

function syncGoalForm() {
  elements.goalCalories.value = state.goals.calories;
  elements.goalProtein.value = state.goals.protein;
  elements.goalCarbs.value = state.goals.carbs;
  elements.goalFat.value = state.goals.fat;
}

function getTotals(entries) {
  return entries.reduce(
    (totals, entry) => {
      const food = state.foods.find((item) => item.id === entry.foodId);
      if (!food) return totals;
      const macros = calculateMacros(food, entry.grams);
      totals.calories += macros.calories;
      totals.protein += macros.protein;
      totals.carbs += macros.carbs;
      totals.fat += macros.fat;
      return totals;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

function calculateMacros(food, grams) {
  const factor = grams / 100;
  return {
    calories: food.calories * factor,
    protein: food.protein * factor,
    carbs: food.carbs * factor,
    fat: food.fat * factor
  };
}

function getSelectedFood() {
  return state.foods.find((food) => food.id === elements.foodSelect.value) || state.foods[0];
}

function getDayEntries() {
  return state.entries[state.date] || [];
}

function persistEntries() {
  if (state.entries[state.date]?.length === 0) {
    delete state.entries[state.date];
  }
  writeStorage(STORAGE.entries, state.entries);
}

function shiftDate(delta) {
  const date = new Date(`${state.date}T12:00:00`);
  date.setDate(date.getDate() + delta);
  state.date = toDateKey(date);
  elements.entryDate.value = state.date;
  writeStorage(STORAGE.date, state.date);
  render();
}

function readNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function safeRatio(value, goal) {
  if (!goal) return 0;
  return value / goal;
}

function round(value) {
  return Number.isInteger(value) ? value : Math.round(value * 10) / 10;
}

function todayKey() {
  return toDateKey(new Date());
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function createId(prefix) {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimer = setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 2200);
}
