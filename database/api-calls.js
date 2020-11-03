var unirest = require("unirest");
var databaseFill = require("./database-build.js");
console.log(databaseFill);

unirest
  .get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/random?limitLicense=false&number=1")
  .header("X-Mashape-Key", "MMIAMKJSDQmshFHH58FZYYZzbiLKp1Vvkw0jsnCK8v2RSuvyTu")
  .header("Accept", "application/json")
  .end(function (result) {
    var recipeObject = {};
    var foo = result.body.recipes[0].instructions;
    foo = foo.replace(/[, ]+/g, " ").trim();
    recipeObject.spoonID = result.body.recipes[0].id;
    recipeObject.name = result.body.recipes[0].title;
    recipeObject.text = foo;
    recipeObject.img = result.body.recipes[0].image + ",";
    var ingredientArr = [];
    for (var i = 0; i < result.body.recipes[0].extendedIngredients.length; i++) {
      var ingredient = {};
      ingredient.name = result.body.recipes[0].extendedIngredients[i].name.toLowerCase();
      ingredient.spoonID = result.body.recipes[0].extendedIngredients[i].id;
      ingredient.img = "https://spoonacular.com/cdn/ingredients_100x100/" + result.body.recipes[0].extendedIngredients[i].image;
      ingredient.amount = result.body.recipes[0].extendedIngredients[i].amount;
      ingredient.unit = result.body.recipes[0].extendedIngredients[i].unit;
      ingredientArr.push(ingredient);
    };
    databaseFill(recipeObject, ingredientArr);
  });