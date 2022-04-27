const FilterUserData = require("./FilterUserData")

module.exports = (food) => {
    return {
        id: food.id,
        name: food.name,
        ingredients: food.ingredients,
        recipe: food.recipe,
        avg_score: food.avg_score,
        about: food.about,
        author:{
            id: food.author_id,
            username:food.author.username,
            avatar_url:food.author.avatar_url,
        },
        photo: food.photo,
        created_at: food.created_at
    }
}