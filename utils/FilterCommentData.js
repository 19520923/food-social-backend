const FilterUserData = require("./FilterUserData")

module.exports = (comment) => {
    return {
        id: comment.id,
        author: {
            id: comment.author_id,
            username: comment.author.username,
            avatar_url: comment.author.avatar_url,
        },
        childrent: comment.childrent,
        content: comment.content,
        created_at: comment.created_at,
    }
}