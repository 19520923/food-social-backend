const Food = require('../../models/Food')
const User = require('../../models/User')
const FoodRate = require('../../models/FoodRate')
const FilterFoodData = require('../../utils/FilterFoodData')
const SendDataToFollower = require('../../utils/socket/SendDataToFollower')
const AvgScore = require('../../utils/AvgScore')
const SendDataToUsers = require('../../utils/socket/SendDataToUsers')

exports.createFood = async (req, res) => {
    try {
        const {name, ingredients, recipe, about = '', photo = ''} = req.body

        author = await User.findById(req.userId)

        error = {}

        if(!name|| name.trim().length === 0){
            error.name = 'Name field must be require'
        }

        if(!ingredients|| ingredients.length === 0){
            error.ingredients = 'Name field must be require'
        }

        if(!recipe|| recipe.trim().length === 0){
            error.name = 'Name field must be require'
        }

        const f_existed = await Food.findOne({name})

        if(f_existed)
        {
            error.name = 'Food already exists'
        }

        if (Object.keys(error).length) {
            return res.status(422).json({error})
        }

        const food = new Food({
            name,
            recipe,
            about,
            photo,
            author: author.id,
            ingredients: ingredients
        })
        
        const savedFood = await food.save()

        const food_obj = await Food.findById(savedFood.id).populate('author')

        const food_data = FilterFoodData(food_obj)

        let dataToSend = {
            req,
            key: 'new-food',
            notify_content: `${food_data.author.username} has post new food recipe`,
            data: food_data,
            notify_type: 'FOOD',
            destination: ''
        }

        await SendDataToFollower(dataToSend)

        return res.status(201).json({message: 'New food created', food: food_data})

    } catch (err) {
        console.log(err)
        return res.status(500),json({error: 'Something went wrong'})
    }
}

exports.deleteFood = async (req, res) => {
    try{
        food = await Food.findById(req.params.food_id).populate('author')

        if(!food){
            return res.status(400).json({error: 'Not found food'})
        }

        if(food.author.id !== req.userId){
            return res.status(400).json({ error: 'You dont have permission'})
        }

        const rates = await FoodRate.find({food})
        
        rates.forEach((rate) => rate.remove())

        food.remove()

        return res.status(200).json({message: 'Remove food successfully'})

    } catch (err) {
        console.log(err)
        return res.status(500).json({error: 'Something went wrong'})
    }
}

exports.rateFood = async (req, res) => {
    try {
        const {food, content, score} = req.body

        error = {}

        if(!food|| food.trim().length ===0){
            error.food = 'Food field must be require'
        }

        if(!content || content.trim().length ===0){
            error.content = 'Content field must be require'
        }

        if(!score){
            error.score = 'Score field must be require'
        }

        if(score < 0 || score > 10){
            error.score = 'Score field must be between 0 and 10'
        }

        if (Object.keys(error).length) {
            return res.status(422).json({error})
        }

        const rate = new FoodRate({
            author: req.userId,
            food: food,
            content,
            score
        })

        const savedRate = await rate.save()

        const food_obj = await Food.findById(food)

        if(!food_obj) {
            return res.json(400).json({error: 'Not found food'})
        }

        food_obj.avg_score = await AvgScore(food_obj)
        food_obj.num_rate += 1

        await food_obj.save()

        await SendDataToUsers({
            req,
            key: 'new-food-rate',
            data: savedRate
        })



        return res.status(201).json({message: 'food saved successfully', food: food_obj})

    } catch (err) {
        console.log(err)
        return res.status(500).json({error: 'Something went wrong'})
    }
}


exports.deleteRate = async (req, res) => {
    try {
        const rate = await FoodRate.findById(req.params.rate_id).populate('author').populate('food')

        if(!rate) {
            return res.status(400).json({error: 'Not found rate'})
        }

        if(req.userId !== rate.author.id) {
            return res.status(400).json({error: 'You dont have permission'})
        }

        rate.remove()

        const food_obj = await Food.findById(rate.food.id)

        if(!food_obj) {
            return res.json(400).json({error: 'Not found food'})
        }

        food_obj.avg_score = await AvgScore(food_obj)
        food_obj.num_rate -= 1

        await food_obj.save()

        await SendDataToUsers({
            req,
            key: 'delete-food-rate',
            data: rate
        })

        return res.status(200).json({message: 'Remove successfully'})
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'})
    }
}