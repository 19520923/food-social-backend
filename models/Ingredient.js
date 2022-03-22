const mongoose = require('mongoose')

const IngredientSchema = mongoose.Schema({
    ingr1: {
        type: String,
    },
    ingr2: {
        type: String,
    },
    npmi: {
        type: Number,
    },
    jaccard: {
        type: Number,
    },
    pmi: {
        type: Number,
    },
    pmi2: {
        type: Number,
    },
    pmi3: {
        type: Number,
    },
    ppmi: {
        type: Number,
    },
    co_occurence: {
        type: Number,
    },
    ingr1_count: {
        type: Number,
    },
    ingr2_count: {
        type: Number,
    },
    lable: {
        type: String,
    },
    ingr1_type: {
        type: String,
    },
    ingr2_type: {
        type: String,
    },
    pairing_type: {
        type: String,
    },
    npmi_normalized: {
        type: Number,
    },
    
})

module.exports = mongoose.model('Ingredient', IngredientSchema)