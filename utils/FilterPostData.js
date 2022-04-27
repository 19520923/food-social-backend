const FilterFoodData = require("./FilterFoodData")
const FilterUserData = require("./FilterUserData")

module.exports = (post) => {
    return ({
            id: post.id,
            foods: post.foods,
            content: post.content,
            photos: post.photos,
            num_comment: post.num_comment,
            reactions: post.reactions,
            location: post.location.name,
            is_public: post.is_public,
            author: FilterUserData(post.author),
            create_at: post.create_at
        }
    )

}