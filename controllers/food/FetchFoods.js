const { Food } = require("../../models/Food");
const FoodRate = require("../../models/FoodRate");
const FilterFoodData = require("../../utils/FilterFoodData");
const FilterUserData = require("../../utils/FilterUserData");

exports.fetchFoodById = async (req, res) => {
    try {
        const food = await Food.findById(req.params.food_id).populate('author')

        const filerFood = FilterFoodData(food)

        const rates = await FoodRate.find({food: req.params.food_id}).populate('author')

        const filterRates = rates.map((rate) => {
            return {
                id: rate.id,
                author: rate.author.id,
                content: rate.content,
                score: rate.score,
            }
        })

        return res.status(200).json({
            food: filerFood,
            rates: filterRates
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Something went wrong'})
    }
}

exports.searchFood = async (req, res) => {
    try {
        const foods = await Food.find(
            {name: {$regex: req.params.search, $options: 'i'}}
        ).populate('author')

        const filterFood = foods.map(food => 
            FilterFoodData(food)
        )

        return res.status(200).json({
            foods: filterFood
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: 'Something went wrong'
        })
    }
}


exports.recomandationFood = async (req, res) => {
    
}