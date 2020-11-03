$(document).ready(function () {
    var holdingArr = [];
    function runIngredientsQuery() {
    // The AJAX function uses the URL of our API to GET the data associated with it (initially set to localhost)
    $.get("/api/ingredients", function(ingredients) {
        function compare(x,y){
            if(x.name < y.name){
                return -1;
            }
            if(y.name < x.name){
                return 1;
            };
            return 0;
        }

        ingredients.sort(compare);
        // Here we then log the ingredients to console, where it will show up as an object.
        console.log(ingredients);
        // console.log("------------------------------------");
        // Loop through and create a card for each ingredient
        for (var i = 0; i < ingredients.length; i++) {
          //This makes the card that serves as the ingredient select
          // Then display the fields in the HTML (Section Name, Date, URL)
          var newCard = $("<div>")
              //do these need to give these a data-type to pass into an array so we can identify them? or using an id?
              newCard.attr("class", "card ingred-card")
              newCard.attr("style", "width: 200px");
              newCard.attr("data-id", `${ingredients[i].id}`)
          var newImg = $("<img>");
              newImg.attr("class", "card-img-top");
              newImg.attr("src", `${ingredients[i].imageLink}`);
          var textDiv = $("<div>");
              textDiv.attr("class", "card-body");
          var ingrName = $("<h5>");
              ingrName.text(`${ingredients[i].name}`);
          textDiv.append(ingrName);
          newCard.append(newImg);
          newCard.append(textDiv);
          $("#ingredientsList").append(newCard);
        }
      });
      $(document).on("click", ".card", function () {
        event.preventDefault();
        //alert("clicked successful")
        // when card is clicked, clicked state of card should become "true" and the ID stored
    
        var foo = $(this);
        console.log(foo)
        if (foo.data('clicked')) {
            //swaps clicked then swaps the color schema
            foo.data('clicked', false);
            foo.removeClass("chosen");
            var work = holdingArr.indexOf(foo.attr("data-id"))
            holdingArr.splice(work, 1);
            //deletes the id from the array
        }
        else {
            foo.data('clicked', true);
            foo.addClass("chosen");
            var ingredCard = foo.attr("data-id");
            //push ingredients into holdingArr for recipe search submit
            holdingArr.push(ingredCard)
            // console.log(foo);
            // console.log(holdingArr);
        }
    })
  }
  runIngredientsQuery();

  

    $("#searchBtn").on("click", function(){
        event.preventDefault();

        //Use to test passing arr to the api
        //var foo = [1,2,3,4];

        foo = JSON.stringify(holdingArr);
        $.post("/api/search", {"hello":foo}, function(response){
            console.log(response);
            response = JSON.stringify(response);
            localStorage.setItem("recipes", response);
            window.location.replace("recipes.html");            
        });
    });
});
