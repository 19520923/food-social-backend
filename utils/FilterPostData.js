const FilterFoodData = require("./FilterFoodData")
const FilterUserData = require("./FilterUserData")

module.exports = (post) => {
    return ({
            id: post.id,
            foods: post.foods.map(food => FilterFoodData(food)),
            content: post.content,
            photos: post.photos,
            num_heart: post.num_heart,
            location: post.location,
            is_public: post.is_public,
            author: FilterUserData(post.author),
            create_at: post.create_at
        }
    )

}