module.exports = function (sequelize, DataTypes) {
  var Recipe = sequelize.define("recipe", {
    name: DataTypes.STRING,
    recipeText: DataTypes.TEXT,
    spoonacularID: DataTypes.INTEGER,
    imageLink: DataTypes.STRING
  });
  return Recipe
};

//recipe.addingredient(ingredient, {through:{amount: 3, unit:"buns"}})