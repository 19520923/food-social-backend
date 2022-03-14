const FoodRate = require("../models/FoodRate")

module.exports = async (food) => {
    ratelist = await FoodRate.find({food})

    sum = 0

    ratelist.forEach(food =>{
        sum += food.score
    })

    console.log(sum)

    return sum/ratelist.length
}