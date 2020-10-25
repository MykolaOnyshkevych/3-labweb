var app = new function() {

  this.el = document.getElementById('exercises');

  this.exercises = [];
  this.filteredByModel = [];
  this.sortedByPrice = [];

  this.sortFinished = false;
  this.searchFinished = false;

  this.Count = function(data) {
    var elementExercise   = document.getElementById('counter');
    var name = 'exercises';

    if (data) {
      if (data == 1) {
        name = 'exercise';
      }
      elementExercise.innerHTML = data + ' ' + name;

      document.getElementById('clear-spoiler').style.display = 'block';
      document.getElementById('search-by-model').style.display = 'block';
    } else {
      elementExercise.innerHTML = 'No ' + name;

      document.getElementById('clear-spoiler').style.display = 'none';
    }
  };

  this.CountPrice = function(array) {
    var el   = document.getElementById('total-price-counter');
    var totalPrice = 0;
    if (array.length > 0) {
      for (i = 0; i < array.length; i++) {
        totalPrice += Number(array[i].price);
      }
    }
    el.innerHTML = 'Total price: ' + totalPrice;
  };

  this.FetchAll = function() {
    var data = '';
    var array = [];
    if (this.searchFinished) {

      if (window.localStorage.getItem("FILTERED")) {
        this.filteredByModel = JSON.parse(window.localStorage.getItem("FILTERED"));
      }

      array = this.filteredByModel;

    } else if (this.sortFinished) {
      
      if (window.localStorage.getItem("SORTED")) {
        this.sortedByPrice = JSON.parse(window.localStorage.getItem("SORTED"));
      }

      array = this.sortedByPrice;

    } else {
      if (window.localStorage.getItem("EXER")) {
        this.exercises = JSON.parse(window.localStorage.getItem("EXER"));
      }
      
      array = this.exercises;
    }

    if (array.length > 0) {
      for (i = 0; i < array.length; i++) {
        data += `<div class="card-class">
        <div id="${i}" class="item text-center" >
          <div class="card-body" style="margin: auto; ">
            
            <h5 class="card-title"><strong>${array[i].price} UAH</strong></h5>
            <p class="card-text">Model: ${array[i].model}<br>
              Type: ${array[i].extype}<br></p>
              Losed weight: ${array[i].weight}<br></p>
            <div class="btn-group">
              <button type="button" class="edit-button-item" onclick="app.Edit(${i})">Edit</button>
              <button type="button" class="cancel-button-item" onclick="app.Delete(${i})">Remove</button>
            </div>
          </div>
        </div>
        </div>`;
      }
    }

    this.Count(array.length);
    this.CountPrice(array);
    

    this.filteredByModel = [];
    this.sortedByPrice = [];
    window.localStorage.removeItem("FILTERED");
    window.localStorage.removeItem("SORTED");

    return this.el.innerHTML = data;
  };

  //////////////////////////////////////////////

  // CREATE ITEM

  this.Add = function () {
    price = Number(document.getElementById('add-price').value);
    model = document.getElementById('add-model').value;
    extype = document.getElementById('add-extype').value;
 
    
    weight = Number(document.getElementById('add-weight').value);

    this.exercises.push({
        price: price,
        model: model,
        extype: extype,
 
        weight: weight
    });

    window.localStorage.setItem("EXER", JSON.stringify(this.exercises));

    price = '';
    model = '';
    extype = '';

  
    weight = '';
    
    this.FetchAll();
  };


  // UPDATE ITEM

  this.Edit = function (item) {
    price = document.getElementById('edit-price');
    model = document.getElementById('edit-model');
    extype = document.getElementById('edit-extype');

    
    weight = document.getElementById('edit-weight');

    price.value = Number(this.exercises[item].price);
    model.value = this.exercises[item].model;
    extype.value = this.exercises[item].extype;

    weight.value = Number(this.exercises[item].weight);

    document.getElementById('edit-spoiler').style.display = 'block';
    self = this;

    document.getElementById('saveEdit').onsubmit = function() {

        price = Number(document.getElementById('edit-price').value);
        model = document.getElementById('edit-model').value;
        extype = document.getElementById('edit-extype').value;
       
        
        weight = Number(document.getElementById('edit-weight').value);

        self.exercises[item] = {
            price: price,
            model: model,
            extype: extype,
        
            
            weight: weight
        };

        window.localStorage.setItem("EXER", JSON.stringify(self.exercises));

        self.FetchAll();
        self.CloseInput();
    }
  };

  // DELETE ITEM

  this.Delete = function (item) {
    this.exercises.splice(item, 1);
    window.localStorage.setItem("EXER", JSON.stringify(this.exercises));
    this.FetchAll();
  };


  // SEARCH (FILTER) BY model

  this.SearchByModel = function() {
    model = document.getElementById('search-model').value;
    this.searchFinished = false;

    if (model) {
      for (i = 0; i < this.exercises.length; i++) {
        if (this.exercises[i].model.toUpperCase() === model.toUpperCase()) {
          this.filteredByModel.push(this.exercises[i]);
          window.localStorage.setItem("FILTERED", JSON.stringify(this.filteredByModel));
        }
      }

      model = '';

    this.searchFinished = true;
    }
    this.FetchAll();
    this.searchFinished = false;
  };

  // SORT (BUBBLE) BY PRICE

  this.BubbleSortByPrice = function() {
    this.sortedByPrice = this.exercises;

    for (i = 0; i < this.sortedByPrice.length; i++) {
      swapped = false;
      for (current_pos = 0; current_pos < this.sortedByPrice.length - i - 1; current_pos++) {
        if(this.sortedByPrice[current_pos].price > this.sortedByPrice[current_pos+1].price) {
          temp = this.sortedByPrice[current_pos];
          this.sortedByPrice[current_pos] = this.sortedByPrice[current_pos+1];
          this.sortedByPrice[current_pos+1] = temp;
          swapped = true;
        }
      }
      if (!swapped) {
        break;
      }
    }
    window.localStorage.setItem("SORTED", JSON.stringify(this.sortedByPrice));

    this.sortFinished = true;
    this.FetchAll();
    this.sortFinished = false;  
  };

  // CLEAR THE LIST

  this.Clear = function() {
    window.localStorage.clear();
    location.reload();
    this.searchFinished = false;
  };


  // CLOSE EDIT

  
  this.CloseInput = function() {
    document.getElementById('edit-spoiler').style.display = 'none';
  };

  this.StopSearch = function() {
    document.getElementById('search-model').value = '';
    this.filteredByModel = [];
    window.localStorage.removeItem("FILTERED");
  };

  // DISPLAY ADD FORM

  this.DisplayAddForm = function() {
    if (document.getElementById('add-form').style.display === 'none') {
      document.getElementById('add-form').style.display = 'block';
    } else {
      document.getElementById('add-form').style.display = 'none';
    }
  };

  // ADD FORM DATA VALIDATION

  document.getElementById('add-form').addEventListener('invalid', (function () {
    return function (myF) {
      myF.preventDefault();
      var modal = document.getElementById('add-modal');
      var span = document.getElementsByClassName('close')[0];
      
      modal.style.display = 'block';
      
      span.onclick = function() {
        modal.style.display = 'none';
      }

      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = 'none';
        }
      }
    };
  })(), true);

  // EDIT FORM DATA VALIDATION

  document.getElementById('edit-spoiler').addEventListener('invalid', (function () {
    return function (myF) {
      myF.preventDefault();
      var modal = document.getElementById('edit-modal');
      var span = document.getElementsByClassName('close')[0];
      
      modal.style.display = 'block';
      
      span.onclick = function() {
        modal.style.display = 'none';
      }

      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = 'none';
        }
      }
    };
  })(), true);

};

app.FetchAll();