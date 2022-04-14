const Post = require('../models/Post')

const haversine_distance = (location1, location2) => {
    var R = 3958.8; // Radius of the Earth in miles
    var rlat1 = location1.lat * (Math.PI/180); // Convert degrees to radians
    var rlat2 = location2.lat * (Math.PI/180); // Convert degrees to radians
    var difflat = rlat2-rlat1; // Radian difference (latitudes)
    var difflon = (location2.lng-location1.lng) * (Math.PI/180); // Radian difference (longitudes)

    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    return d;
  }

module.exports = FindCloseLocation = async (location, posts) => {
    const disttance = 10 //km
    let postData = []

    posts.forEach(post => {
        if(haversine_distance(location, post.location) <= disttance) {
            postData.push(post);
        }
    })

    return postData;
}