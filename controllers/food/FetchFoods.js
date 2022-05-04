const Food = require("../../models/Food");
const FoodRate = require("../../models/FoodRate");
const Ingredient = require("../../models/Ingredient");
const FilterFoodData = require("../../utils/FilterFoodData");
const FilterUserData = require("../../utils/FilterUserData");

exports.fetchFoodById = async (req, res) => {
    try {
        const food = await Food.findById(req.params.food_id).populate('author')

        //const filerFood = FilterFoodData(food)

        const rates = await FoodRate.find({ food: req.params.food_id }).populate('author').sort({ created_at: -1 })

        const filterRates = rates.map((rate) => {
            return {
                id: rate.id,
                author: FilterUserData(rate.author),
                content: rate.content,
                score: rate.score,
            }
        })

        return res.status(200).json({
            food: food,
            rates: filterRates
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

exports.searchFood = async (req, res) => {
    try {
        const foods = await Food.find(
            { name: { $regex: req.params.search, $options: 'i' } }
        ).populate('author')

        return res.status(200).json({
            foods: foods
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: 'Something went wrong'
        })
    }
}

exports.fetchAllFood = async (req, res) => {
    let page = parseInt(req.query.page || 0)
    let limit = 10

    try {
        const foods = await Food.find({})
            .sort({ created_at: 1 })
            .limit(limit)
            .skip(page * limit)
            .populate('author')

        //const filterFoods = foods.map((comment) => FilterFoodData(comment))
        const totalCount = await Food.countDocuments({})

        const paginationData = {
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
            totalFoods: totalCount,
        }
        res
            .status(200)
            .json({ foods: foods, pagination: paginationData })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

exports.recomandationIngrName = async (req, res) => {
    try {
        if(req.params.search == '') return
        const list = await Ingredient.aggregate([
            { $match: { ingr1: { $regex: '^' + req.params.search, $options: 'i' } } },
            {
                $group: {
                    _id: "$ingr1",
                }
            },
            { $sort: { id: -1 } },
            { $limit: 10 },
        ])

        return res.status(200).json({
            ingredients: list
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

exports.recomendataionPairing = async (req, res) => {
    try {
        const { ingrs } = req.body
        const list = await Ingredient.aggregate([
            {
                $match: {
                    ingr1: { $in: ingrs },
                    ingr2: { $nin: ingrs }
                }
            },
            { $sort: { npmi: -1 } },
            // {$project: {
            //     "npmi": 1,
            //     "ingr2_type": 1,
            //     "ingr2": {$setUnion: ["ingr2", []]}
            // }},
            { $limit: 10 },
        ])

        const data = list.map(ingr => ({
            ingr: ingr.ingr2,
            score: ingr.npmi,
            type: ingr.ingr2_type
        }))

        return res.status(200).json({
            ingrediens: data
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Something went wrong' })
    }
}


exports.fetchUserFood = async (req, res) => {
    let page = parseInt(req.query.page || 0)
    let limit = 10

    try {
        const foods = await Food.find({ author: req.userId })
            .sort({ created_at: 1 })
            .limit(limit)
            .skip(page * limit)
            .populate('author')

        //const filterFoods = foods.map((comment) => FilterFoodData(comment))
        const totalCount = await Food.countDocuments({ author: req.userId })

        const paginationData = {
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
            totalFoods: totalCount,
        }
        res
            .status(200)
            .json({ foods: foods, pagination: paginationData })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

exports.fetchTrendingFood = async (req, res) => {
    let page = parseInt(req.query.page || 0)
    let limit = 10

    try {
        const foods = await Food.find({})
            .sort({ num_rate: -1, avg_score: -1, created_at: 1 })
            .limit(limit)
            .skip(page * limit)
            .populate('author')

        //const filterFoods = foods.map((comment) => FilterFoodData(comment))
        const totalCount = await Food.countDocuments({})

        const paginationData = {
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
            totalFoods: totalCount,
        }
        res
            .status(200)
            .json({ foods: foods, pagination: paginationData })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

exports.fetchAllRate = async (req, res) => {
    let page = parseInt(req.query.page || 0)
    let limit = 10

    try {
        const comments = await FoodRate.find({ food: req.params.food_id })
            .sort({ created_at: -1 })
            .limit(limit)
            .skip(page * limit)
            .populate('author')

        const totalCount = await FoodRate.countDocuments({ food: req.params.food_id })

        const paginationData = {
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
            totalRates: totalCount,
        }
        res
            .status(200)
            .json({ rates: comments, pagination: paginationData })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Something went wrong" })
    }
}