const { listen } = require("express/lib/application");
const Food = require("../../models/Food");
const FoodRate = require("../../models/FoodRate");
const Ingredient = require("../../models/Ingredient");
const FilterFoodData = require("../../utils/FilterFoodData");
const FilterUserData = require("../../utils/FilterUserData");
const StringFormat = require("../../utils/StringFormat");

exports.fetchFoodById = async (req, res) => {
    try {
        const food = await Food.findById(req.params.food_id).populate('author')

        const filerFood = FilterFoodData(food)

        const rates = await FoodRate.find({food: req.params.food_id}).populate('author').sort({created_at: -1})

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

exports.recomandationIngrName = async(req, res) => {
    try {
        const list = await Ingredient.aggregate([
            {$match: {ingr1:{ $regex: '^'+req.params.search}}},
            {$group : {
                _id : "$ingr1",
                count: { $sum: 1 }
             }},
             {$sort: {id: 1}},
             {$limit: 10},
    ])
        
        const data = list.map(ingr => 
            StringFormat(ingr._id)
        )

        return res.status(200).json({
            ingredients: data
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Something went wrong'})
    }
}

exports.recomendataionPairing = async (req, res) => {
    try {
        const {ingrs} = req.body

        const list = await Ingredient.aggregate([
            {$match: {ingr1: { $in: ingrs}}},
            {$sort: {npmi: -1}},
            
            {$limit: 20},
        ])

        const data = list.map(ingr => ({
            ingr: StringFormat(ingr.ingr2),
            score: ingr.npmi,
            type: ingr.ingr2_type
        }))

        return res.status(200).json({
            ingrediens: data
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Something went wrong'})
    }
}