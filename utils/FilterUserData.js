module.exports = (user) => {
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
        is_current: user.is_current,
        avatar_url: user.avatar_url,
        cover_url: user.cover_url,
        about: user.about,
        last_login: user.last_login,
        created_at: user.created_at,
        follower: user.follower.map(friend => ({
            id: friend.id,
            first_name: friend.first_name,
            last_name: friend.last_name,
            username: friend.username,
            email: friend.email,
            is_current: friend.is_current,
            avatar_url: friend.avatar_url,
            cover_url: friend.cover_url,
            about: friend.about,
            last_login: friend.last_login,
            created_at: friend.created_at,
        })),

        following: user.following.map(friend => ({
            id: friend.id,
            first_name: friend.first_name,
            last_name: friend.last_name,
            username: friend.username,
            email: friend.email,
            is_current: friend.is_current,
            avatar_url: friend.avatar_url,
            cover_url: friend.cover_url,
            about: friend.about,
            last_login: friend.last_login,
            created_at: friend.created_at,
        }))
    }
}