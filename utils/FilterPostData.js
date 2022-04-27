const FilterFoodData = require("./FilterFoodData")
const FilterUserData = require("./FilterUserData")

module.exports = (post) => {
    return {
        id: post.id,
        foods: post.foods,
        content: post.content,
        photos: post.photos,
        num_comment: post.num_comment,
        num_heart: post.num_heart,
        reactions: post.reactions,
        location: post.location.name,
        is_public: post.is_public,
        author: {
            id: post.user_id,
            username: post.author.username,
            avatar_url: post.author.avatar_url,
        },
        create_at: post.create_at,
    }
}