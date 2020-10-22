const exercisesList = document.getElementById('exercises-list');
const searchExercise = document.getElementById('find-exercise');
const clearButton = document.getElementById('clear-search-bar');


let exercises = [
    {
        id: 1,
        model: "Step Platform",
        gainOfWeightInKilo: 0.2,
        price: 50 
    },
    
    {
        id: 2,
        model: "Race Track",
        gainOfWeightInKilo: 0.4,
        price: 120 
    },
    {
        id: 3,
        model: "Running",
        gainOfWeightInKilo: 0.1,
        price: 70
    },
    {
        id: 4,
        model: "Power Lifting",
        gainOfWeightInKilo: 0.9,
        price: 600 
    },
    {
        id: 5,
        model: "Greef",
        gainOfWeightInKilo: 0.6,
        price: 250 
    },
    {
        id: 6,
        model: "Ball",
        gainOfWeightInKilo: 0.43,
        price: 40 
    }
]
let shownExercises = exercises;


//write smth
searchExercise.addEventListener('keyup', (searchedString) => {
    const findFilterString = searchedString.target.value.toLowerCase();
    const findExercisesByModel = exercises.filter(exercise =>{
        return exercise.model.toLowerCase().includes(findFilterString);
    });
    shownExercises = findExercisesByModel;
    showExerciseListSorted();
})

//clear written
clearButton.addEventListener('click', ()=> {
    searchExercise.value = '';
    shownExercises = exercises;
    showExerciseListSorted();
})

//count sum
function countPriceOfProgram(){
    let priceSum = 0;
    let totalPriceLabel = document.getElementById('total-price');
    shownExercises.forEach(exercise => priceSum += exercise.price);
    totalPriceLabel.textContent = 'Total price: ' + priceSum +' '+ 'UAH';
}



//sort items
function showExerciseListSorted(){
    let sortType = document.getElementById('sort-select').value;
    console.log(sortType);
    if (sortType == 'none'){
        displayExercises(shownExercises);
        return;
    } else if (sortType == 'model'){
        shownExercises.sort(compareByName);
    } else if (sortType == 'weightInKilos'){
        shownExercises.sort(compareByWeight);
    }
    else if (sortType == 'price'){
        shownExercises.sort(compareByPrice);
    }
    displayExercises(shownExercises);
}

function compareByName(exerciseFirst, exerciseSecond){
    let exerciseModelFirst = exerciseFirst.model.toLowerCase();
    let exerciseModelSecond = exerciseSecond.model.toLowerCase();
    if (exerciseModelFirst < exerciseModelSecond) {
        return -1;
    }
    if (exerciseModelFirst > exerciseModelSecond) {
        return 1;
    }
    return 0;
}

function compareByWeight(exerciseFirst, exerciseSecond){
    return exerciseFirst.gainOfWeightInKilo - exerciseSecond.gainOfWeightInKilo;
}

function compareByPrice(exerciseFirst, exerciseSecond){
    return exerciseFirst.price- exerciseSecond.price;
}



//display the items
const displayExercises = (exercisesAvailable) => {
    const displayItems = exercisesAvailable.map((exercise)=>{
        return `
        <li class="exercise_item">
            <h2> ${exercise.model}</h2>
            <h3>Weight in kilo: ${exercise.gainOfWeightInKilo} kg</h3>
            <h3>Price per hour: ${exercise.price} UAH</h3>
            <div class= "control-buttons">
                <button class="edit-button" id="edit-button">Edit</button>
                <button class="delete-button" id="delete-button">Delete</button>
            </div>
            
        </li>
        `
    }).join('');

    exercisesList.innerHTML = displayItems;
}

displayExercises(shownExercises)