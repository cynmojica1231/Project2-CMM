var db = require("../models");
var Sequelize = require("sequelize");
var Op = Sequelize.Op;
var databaseFill = require("../database/database-build");
var textMe = require("../public/js/twilio_f2t.js");

module.exports = function(app) {
  // Get all ingredients

  app.get("/api/ingredients", function(req, res) {
    db.ingredient.findAll({}).then(function(ingredients) {
      res.json(ingredients);
    });
  });

  // Create a new recipe
  app.post("/api/new-recipe", function(req, res) {
    var recipe = JSON.parse(req.body.recipe);
    var ingredientsArray = JSON.parse(req.body.ingredients);
    var databasePromise = new Promise(function(resolve, reject) {
      resolve(databaseFill(recipe, ingredientsArray));
    });
    databasePromise.then(function (newRecipe) {
      res.json(newRecipe);
    });
  });

  //using the selected ingredients, find all recipes that contain at least the selected ingredient
  app.post("/api/search/", function(req, res) {
    console.log(req.body);
    var foo = JSON.parse(req.body.hello);
    console.log(foo);
    //foo = [1,4];
    db.recipe
      .findAll({
        include: [
          {
            model: db.ingredient,
            as: "Ingredients",
            where: { id: { [Op.in]: foo } }
          }
        ]
      })
      .then(function(returnedRecipes) {
        console.log(returnedRecipes);
        res.json(returnedRecipes);
      });
  });

  app.post("/api/ingrSearch", function(req, res) {
    // var working = JSON.parse(req.body.recipe);
    db.ingredient
      .findAll({
        include: [
          {
            model: db.recipe,
            as: "Recipes",
            where: { id: req.body.recipe }
          }
        ]
      })
      .then(function(returnedRecipes) {
        console.log(returnedRecipes);
        res.json(returnedRecipes);
      });
  });

  app.post("/api/unitAmount", function(req, res){
    var iArr = JSON.parse(req.body.ingredientsID);
      db.recipeIngredient.findAll({
      where:{
        recipeId : req.body.recipeID,
        ingredientId: {[Op.in]:iArr}
      }
    }).then(function(returnedRecipes) {
    console.log(returnedRecipes);
    res.json(returnedRecipes);
  });
});

  app.post("/api/twilio", function(req, res) {
    var ingredToText = JSON.parse(req.body.ingredients);
    var phone = req.body.phone;
    var ingredString = "";
    for(i = 0; i < ingredToText.length; i++) {
      ingredString += ingredToText[i] + "\n";
    }
    console.log(ingredString, phone);
    textMe(ingredString, phone);
  })
};
