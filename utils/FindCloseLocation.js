const Post = require('../models/Post')

const rad = (x) => {
    return x*Math.PI/180
}

module.exports = FindCloseLocation = async (location, posts) => {
    const R = 6371
    const distance = 5
    const lat = location.split(',')[0]
    const lon = location.split(',')[1]
    let pList = []

    posts.forEach(post => {
        var dLat = (lat)
    });
}