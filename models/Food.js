const mongoose = require('mongoose')

const FoodSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: true
    }
})

const PostSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: true
    },

    ingredients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient'
        }
    ],

    recipe: {
        type: String,
        trim: true,
        require: true
    },

    avg_score: {
        type: Number,
        default: 0
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
    {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
)

const Food =  mongoose.model('food', FoodSchema)
const Ingredient = mongoose.model('ingredient', IngredientSchema)
module.exports = {Food, Ingredient}