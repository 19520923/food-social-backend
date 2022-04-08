const FilterUserData = require("./FilterUserData")

module.exports = (comment) => {
    return {
        id: comment.id,
        author: FilterUserData(comment.author),
        childrent: comment.childrent,
        content: comment.content,
        created_at: comment.created_at,
    }
}