const exerciseList = document.getElementById('exercise__list');
const inputExercise = document.getElementById('header__input');
const clearButton = document.getElementById('clear__btn');


let exercises = [];

exercisesString = exercisesString.replaceAll('&quot;', '"');
if (exercisesString != '') {
    exercises = JSON.parse(exercisesString);
}

let shownExercises = exercises;

function getExerciseItem(id, title, weightInKilos, priceInUAH) {
    return `
    <li id="${id}" class="exercise__item">
        <h3 class="exercise__item__title">${title}</h3>
        <p class="exercise__item__paragraph">Weight In Kilos: ${weightInKilos}</p>
        <p class="exercise__item__paragraph">Price: ${priceInUAH} UAH</p>
        <div class= "control__buttons">
            <button class="item__btn edit__btn popup__link" href="#popup__edit" id="edit__btn">Edit</button>
            <button class="item__btn delete__btn" id="delete__btn">Delete</button>
        </div>
    </li>
    `
}

//display items
const displayExercises = (exercises) => {
    const displayItems = exercises.map((exercise) => {
        return getExerciseItem(exercise._id, exercise.title, exercise.weightInKilos, exercise.priceInUAH)
    }).join('');

    exerciseList.innerHTML = displayItems;
}

//sort
function showExerciseListSorted() {
    let sortType = document.getElementById('sort__select').value;
    if (sortType == 'none') {
        displayExercises(shownExercises);
        return;
    } else if (sortType == 'model') {
        shownExercises.sort(compareByName);
    } else if (sortType == 'weightInKilos') {
        shownExercises.sort(compareByWeight);
    } else if (sortType == 'price') {
        shownExercises.sort(compareByPrice);
    }
    displayExercises(shownExercises);
}
function compareByName(exerciseFirst, exerciseSecond) {
    let exerciseModelFirst = exerciseFirst.title.toLowerCase();
    let exerciseModelSecond = exerciseSecond.title.toLowerCase();
    if (exerciseModelFirst < exerciseModelSecond) {
        return -1;
    }
    if (exerciseModelFirst > exerciseModelSecond) {
        return 1;
    }
    return 0;
}

function compareByWeight(exerciseFirst, exerciseSecond) {
    return exerciseFirst.weightInKilos - exerciseSecond.weightInKilos;
}

function compareByPrice(exerciseFirst, exerciseSecond) {
    return exerciseFirst.priceInUAH - exerciseSecond.priceInUAH;
}

//write input
inputExercise.addEventListener('keyup', (searchedString) => {
    const findFilterString = searchedString.target.value.toLowerCase();
    const findExercisesByTitle = exercises.filter(exercise => {
        return exercise.title.toLowerCase().includes(findFilterString);
    });
    shownExercises = findExercisesByTitle;
    showExerciseListSorted();
})

//clear input
clearButton.addEventListener('click', () => {
    inputExercise.value = '';
    shownExercises = exercises;
    showExerciseListSorted();
})

//count total price
function countTotalPrice() {
    let sum = 0;
    let totalPrice = document.getElementById('total__price');
    shownExercises.forEach(exercise => sum += exercise.priceInUAH);
    totalPrice.textContent = 'Total price: ' + sum + ' UAH';
}

displayExercises(shownExercises)


//  popup add and edit //

const popupLinks = document.querySelectorAll('.popup__link');
const body = document.querySelectorAll('body')[0];
const lockPadding = document.querySelectorAll('.lock__padding');

let unlock = true;

const timeout = 500;

for (let index = 0; index < popupLinks.length; index++) {
    const popupLink = popupLinks[index];
    popupLink.addEventListener('click', function (element) {
        const popupName = popupLink.getAttribute('href').replace('#', '');
        //console.log(popupName)
        const curentPopup = document.getElementById(popupName);
        //console.log(curentPopup)
        popupOpen(curentPopup);
        element.preventDefault();
    });
}

const popupCloseIcons = document.querySelectorAll('.close__popup');
for (let index = 0; index < popupCloseIcons.length; index++) {
    const popupCloseIcon = popupCloseIcons[index];
    popupCloseIcon.addEventListener('click', function (element) {
        popupClose(popupCloseIcon.closest('.popup'));
        element.preventDefault();
    });
}

function popupOpen(curentPopup) {
    if (curentPopup && unlock) {
        const popupActive = document.querySelector('.popup.open__popup');
        if (popupActive) {
            popupClose(popupActive, false);
        } else {
            bodyLock();
        }
        curentPopup.classList.add('open__popup');
   
        curentPopup.addEventListener('click', function (element) {
            if (!element.target.closest('.popup__content')) {
                popupClose(element.target.closest('.popup'))
            }
        });
    }
}

function popupClose(popupActive, doUnlock = true) {
    if (unlock) {
        popupActive.classList.remove('open__popup');
        if (doUnlock) {
            bodyUnLock();
        }
    }
}

function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector('.header').offsetWidth + 'px';

    for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index];
        el.style.paddingRight = lockPaddingValue;
    }
    body.style.paddingRight = lockPaddingValue;
    body.classList.add('lock__body');

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

function bodyUnLock() {
    setTimeout(function () {
        for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = '0px';
        }
        body.style.paddingRight = '0px';
        body.classList.remove('lock__body');
    }, timeout)

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

//close popup with esc
document.addEventListener('keydown', function (element) {
    if (element.which === 27) {
        const popupActive = document.querySelector('.popup.open__popup');
        popupClose(popupActive);
    }
});


//  submit in add popup  //

//submit
let addExerciseExceptions = [];
const addSubmitBtn = document.getElementById('submit__add__exercise__btn');
const addInputModel = document.getElementById('add__input__model');
const addInputWeight = document.getElementById('add__input__weight');
const addInputPrice = document.getElementById('add__input__price');

let model;
let weightInKilos;
let price;


addSubmitBtn.addEventListener('click', function (event) {
    model = addInputModel.value;
    weightInKilos = addInputWeight.value;
    price = addInputPrice.value;


    if (model === '') {
        addExerciseExceptions.push('Please, enter the model.');
    }
    if (weightInKilos === '') {
        addExerciseExceptions.push('Please, enter weight.');
    }
    if (price === '') {
        addExerciseExceptions.push('Please, enter the price.');
    }
    if (addExerciseExceptions.length > 0) {
        alert(addExerciseExceptions[0]);
        addExerciseExceptions = [];
    } else {
        addExercise();
        //close popup 
        const popupActive = document.querySelector('.popup.open__popup');
        popupClose(popupActive);
        //clean input
        addInputModel.value = '';
        addInputWeight.value = '';
        addInputPrice.value = '';
    }
});


async function addExercise() {

    let exercise = {
        "title": model,
        "weightInKilos": weightInKilos,
        "priceInUAH": price
    };
    exerciseString = JSON.stringify(exercise);

    let response = await fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: exerciseString
    });
    if (response.status == 200) {
        console.log(response.status, ': Exercise was added successfully.');
    } else {
        console.log(response.status, ': Something went wrong while add!');
        alert('Something went wrong! Please, try again later.');
    }

}

const deleteButtons = document.querySelectorAll('#delete__btn');

for (let index = 0; index < deleteButtons.length; index++) {
    const deleteButton = deleteButtons[index];
    deleteButton.addEventListener('click', function (element) {
        id = deleteButton.closest('.exercise__item').id;
        deleteExercise(id);
    });
}

async function deleteExercise(id) {

    exercise = {
        "id": id
    }
    exerciseString = JSON.stringify(exercise);

    let response = await fetch('/', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: exerciseString
    });

    if (response.status == 200) {
        console.log(response.status, ':Exercise was deleted successfully.');
        hideElement(id);
    } else {
        console.log(response.status, ': Something went wrong while delete!');
        alert('Something went wrong! Please, try again later.')
    }
}

function hideElement(id) {
    let element = document.getElementById(id);
    element.classList.add('hiden');
}




const editButtons = document.querySelectorAll('#edit__btn');
let editId;
for (let index = 0; index < editButtons.length; index++) {
    const editButton = editButtons[index];
    editButton.addEventListener('click', function (element) {
        editId = editButton.closest('.exercise__item').id;
    });
}


//  submit in edit popup  //
//submit
const editSubmitBtn = document.getElementById('submit__edit__exercise__btn');
const editInputModel = document.getElementById('edit__input__name');
const editInputWeight = document.getElementById('edit__input__weight');
const editInputPrice = document.getElementById('edit__input__price');

let nameUpdate;
let weightUpdate;
let priceUpdate;


editSubmitBtn.addEventListener('click', function (event) {
    nameUpdate = editInputModel.value;
    weightUpdate = editInputWeight.value;
    priceUpdate = editInputPrice.value;
    updateExercise()
    //close popup 
    const popupActive = document.querySelector('.popup.open__popup');
    popupClose(popupActive);
    //clean input
    addInputModel.value = '';
    addInputWeight.value = '';
    addInputPrice.value = '';
});


async function updateExercise() {

    exercise = {
        "id": editId,
        "title": nameUpdate,
        "weightInKilos": weightUpdate,
        "priceInUAH": priceUpdate,
    }

    exerciseString = JSON.stringify(exercise);

    let response = await fetch('/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: exerciseString
    });
    if (response.status == 200) {
        console.log(response.status, ': Exercise was edited successfully.');
    } else {
        console.log(response.status, ': Something went wrong while edit!');
        alert('Something went wrong! Please, try again later.')
    }
}