let favoriteMeals = JSON.parse(localStorage.getItem('favoriteMeals')) || [];
let mealData = []; // This will store the fetched meal data

// Fetch meal data from TheMealDB API
async function fetchMeals() {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    mealData = data.meals || [];  // Get the list of meals from the API response
    renderMeals();
}

const calorieMap = {
    "Migas": 400,
    "Sushi": 300,
    "Burek": 450,
    "Corba": 150,
    "Kumpir": 500,
    "Tamiya": 300, // Egyptian falafel
    "Bistek": 480,
    "Wontons": 350,
    "Kafteji": 380,
    "Big Mac": 550,
    "Lasagne": 600,
    "Timbits": 70, // per piece
    "Dal fry": 280,
    "Koshari": 450,
    "Poutine": 740,
    "Pancakes": 350,
    "Kapsalon": 1000,
    "Moussaka": 500,
    "Shawarma": 600,
    "Fish pie": 450,
    "Stamppot": 400,
    "Flamiche": 420,
    "Kedgeree": 460,
    "Ribollita": 300,
    "Roti john": 500
};


// Render meal data to the page
function renderMeals() {
    const mealList = document.getElementById("mealList");
    mealList.innerHTML = ''; // Clear previous meal cards
    mealData.forEach((meal, index) => {
        const card = `
          <div class="col-md-4 meal-card mb-4">
            <div class="card" onclick="showMealDetails(${index})" style="cursor:pointer">
              <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
              <div class="card-body">
                <h5 class="meal-name card-title">${meal.strMeal}</h5>
                <p class="card-text">${meal.strCategory}</p>
                <p><strong>Calories: ${calorieMap[meal.strMeal] || 'N/A'} kcal</strong></p>
                <div class="d-flex">
                    <button class="btn btn-success" onclick="addFavorite(${index}); event.stopPropagation();">Add to Favorites</button>
                    <button class="btn btn-secondary ms-2" onclick="addMealToIntake(${index}); event.stopPropagation();">Add to Daily Intake</button>
                </div>
              </div>
            </div>
          </div>
        `;
        mealList.innerHTML += card;
    });
}


function showMealDetails(index) {
    const meal = mealData[index];
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
            ingredients.push(`${ingredient} - ${measure}`);
        }
    }

    const modalBody = `
        <h5>${meal.strMeal}</h5>
        <img src="${meal.strMealThumb}" class="img-fluid mb-3 " alt="${meal.strMeal}" style="max-height: 300px;">
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Area:</strong> ${meal.strArea}</p>
        <h6>Ingredients:</h6>
        <ul>
            ${ingredients.map(item => `<li>${item}</li>`).join('')}
        </ul>
    `;

    document.getElementById('mealModalBody').innerHTML = modalBody;
    const mealModal = new bootstrap.Modal(document.getElementById('mealModal'));
    mealModal.show();
}


// Function to add meal to favorites
function addFavorite(mealId) {
    if (!favoriteMeals.includes(mealId)) {
        favoriteMeals.push(mealId);
        localStorage.setItem('favoriteMeals', JSON.stringify(favoriteMeals));
        alert("Meal added to favorites!");
        renderFavoriteMeals();
    } else {
        alert("Meal is already in favorites.");
    }
}

// Meal search functionality
function searchMeals() {
    let query = document.getElementById("mealSearch").value.toLowerCase();
    let mealCards = document.getElementsByClassName("meal-card");
    for (let card of mealCards) {
        let mealName = card.getElementsByClassName("meal-name")[0].innerText.toLowerCase();
        if (mealName.includes(query)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    }
}


function renderFavoriteMeals() {
    const favList = document.getElementById("favoriteMealsList");
    favList.innerHTML = ''; // Clear previous

    const favorites = favoriteMeals.map(id => mealData[id]).filter(Boolean);
    if (favorites.length === 0) {
        favList.innerHTML = '<p class="text-secondary">You have no favorite meals yet.</p>';
        return;
    }

    favorites.forEach((meal, index) => {
        const favCard = `
        <div class="col-md-4">
          <div class="card">
            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
            <div class="card-body">
              <h5 class="card-title">${meal.strMeal}</h5>
              <p class="card-text">${meal.strCategory}</p>
              <button class="btn btn-danger" onclick="removeFavorite(${favoriteMeals[index]})">Remove from Favorites</button>
            </div>
          </div>
        </div>
      `;
        favList.innerHTML += favCard;
    });


}

function addMealToIntake(index) {
    const meal = mealData[index];
    const name = meal.strMeal;
    const cal = calorieMap[name] || 0;

    // Skip if calories not found
    if (!cal) {
        alert("No calorie data available for this meal.");
        return;
    }

    const item = {
        name,
        calories: cal
    };

    dailyIntakeItems.push(item);

    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.textContent = `${name} - ${cal} kcal`;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-danger btn-sm';
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = function () {
        removeIntake(item);
    };

    li.appendChild(removeBtn);
    document.getElementById('intakeList').appendChild(li);

    totalCalories += cal;
    document.getElementById('totalCalories').textContent = totalCalories;
}


// Remove favorite meals
function removeFavorite(mealId) {
    favoriteMeals = favoriteMeals.filter(id => id !== mealId);
    localStorage.setItem('favoriteMeals', JSON.stringify(favoriteMeals));
    renderFavoriteMeals(); // Update the list
}



// Daily Intake Tracker
let totalCalories = 0;
let dailyIntakeItems = [];

function addIntake() {
    const name = document.getElementById('foodName').value;
    const cal = parseInt(document.getElementById('foodCalories').value);
    if (!name || isNaN(cal)) return;

    // Create a new item object
    const item = {
        name,
        calories: cal,
    };

    // Add the item to the array
    dailyIntakeItems.push(item);

    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.textContent = `${name} - ${cal} kcal`;

    // Create a "Remove" button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-danger btn-sm';
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = function () {
        removeIntake(item); // Remove the item from the array and update the list
    };

    // Append the remove button to the list item
    li.appendChild(removeBtn);

    document.getElementById('intakeList').appendChild(li);

    totalCalories += cal;
    document.getElementById('totalCalories').textContent = totalCalories;

    document.getElementById('foodName').value = '';
    document.getElementById('foodCalories').value = '';
}

function removeIntake(item) {
    // Remove the item from the array
    dailyIntakeItems = dailyIntakeItems.filter(i => i !== item);

    // Recalculate the total calories after removal
    totalCalories = dailyIntakeItems.reduce((sum, currentItem) => sum + currentItem.calories, 0);
    document.getElementById('totalCalories').textContent = totalCalories;

    // Re-render the daily intake list
    renderIntakeList();
}

function renderIntakeList() {
    const intakeList = document.getElementById('intakeList');
    intakeList.innerHTML = '';

    dailyIntakeItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.textContent = `${item.name} - ${item.calories} kcal`;

        // Create a "Remove" button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-danger btn-sm';
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = function () {
            removeIntake(item);
        };

        li.appendChild(removeBtn);

        intakeList.appendChild(li);
    });
}


// Initialize favourites on page load
window.onload = function () {
    fetchMeals();
    renderFavoriteMeals();
}