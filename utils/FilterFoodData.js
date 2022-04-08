const FilterUserData = require("./FilterUserData")

module.exports = (food) => {
    return {
        id: food.id,
        name: food.name,
        ingredients: food.ingredients,
        recipe: food.recipe,
        avg_score: food.avg_score,
        about: food.about,
        author: FilterUserData(food.author),
        photo: food.photo,
        created_at: food.created_at
    }
}