$(document).ready(function () {
  var foo = localStorage.getItem("recipes");
  foo = JSON.parse(foo);
  console.log(foo);

  function queryIngredients(recipeID) {
    console.log(recipeID);
    $.post("/api/ingrSearch", {
      recipe: recipeID
    }, function (response) {
      console.log(response);
      //need to pull amount and units from recipe_ingredients table
      unitAmountCall(response, recipeID);
    });
  }

  // function unitAmountCall(ingredientSearchResponse, recipe) {
  //   var ingredientsArr = [];
  //   ingredientSearchResponse.forEach(element => {
  //     ingredientsArr.push(element.id);
  //   });
  //   $.post("/api/unitAmount", {
  //     "ingredientsID": JSON.stringify(ingredientsArr),
  //     "recipeID": recipe
  //   }, function (response) {
  //     console.log(response)
  //   });
  // }

  foo.forEach(element => {
    var newCard = $("<div>");
    var image = element.imageLink;
    image = image.substring(0, image.length - 1);

    //do these need to give these a data-type to pass into an array so we can identify them? or using an id?
    newCard.attr("class", "card mb-3");
    var newImgContainer = $("<div>");
    newImgContainer.attr("class", "recipe-card-image");
    var newImg = $("<img>");
    newImg.attr("class", "card-img-top");
    newImg.attr("src", `${image}`);
    newImgContainer.append(newImg);
    var textDiv = $("<div>");
    textDiv.attr("class", "card-body");
    var ingrName = $("<h5>");
    ingrName.attr("class", "card-title");
    ingrName.text(`${element.name}`);
    textDiv.append(ingrName);
    var button = $("<button>");
    button.attr("type", "button");
    button.attr("class", "btn btn-primary");
    button.attr("data-toggle", "modal");
    button.attr("data-target", "#recipeModal");
    button.attr("data-id", `${element.id}`);
    button.attr("data-name", `${element.name}`);
    button.attr("data-img", `${element.imageLink}`);
    button.attr("data-text", `${element.recipeText}`);
    button.text("Get Full Recipe");
    newCard.append(newImgContainer);
    newCard.append(textDiv);
    newCard.append(button);
    $("#recipes-Cards").append(newCard);
  });

  $('#recipeModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var recipeID = button.data("id");
    var recipeName = button.data("name"); // Extract info from data-* attributes
    var recipeImg = button.data("img");
    var recipeText = button.data("text");
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var allIngredientsArr = [];
    var ingredientIDs = [];
    $.post("/api/ingrSearch", {
      recipe: recipeID
    }, function (response) {
      console.log(response);
      var modal = $("#recipeModal");
      modal.find(".modal-body").append("<br><br><p><b>Ingredients: </b></p>")
      response.forEach(element => {
        modal.find('.modal-body').append("<li id=" + element.id + ">" + element.name + "</li>");
        ingredientIDs.push(element.id);
        allIngredientsArr.push(element.name);
      });
      //need to pull amount and units from recipe_ingredients table
      $.post("/api/unitAmount", {
        "ingredientsID": JSON.stringify(ingredientIDs),
        "recipeID": recipeID
      }, function (response) {
        console.log(response);
        var modal = $("#recipeModal");
        response.forEach(element => {
          modal.find(`#${element.ingredientId}`).prepend(element.amount + " " + element.unit + " ");
        });
      });
    });

    $("#text-button").on("click", function () {
      event.preventDefault();
      anotherIngredientsArr = JSON.stringify(allIngredientsArr);
      phoneNumber = $("#phone-number").val().trim();
      $.post("/api/twilio", {
        ingredients: anotherIngredientsArr,
        phone: phoneNumber
      }, function (response) {
        console.log(response);
      });
    });
    function print() {
      printJS({
        printable: 'single-recipe',
        type: 'html',
        targetStyles: ['*'],
        ignoreElements: ['single-recipe-footer']
     })
    }
    $("#print-button").on("click", function () {
      event.preventDefault();
      print();
  });
    

    var modal = $(this)
    modal.find('.modal-title').text(recipeName);
    modal.find('.modal-body').text(recipeText + "\n\n");
  });


});