const router = require('express').Router()
const authRequired = require('../middleware/AuthMiddleware')
const {createFood, deleteFood, rateFood, deleteRate} = require('../controllers/food/FoodActions')
const { fetchFoodById, searchFood, recomandationIngrName, recomendataionPairing } = require('../controllers/food/FetchFoods')

router.post('/create', authRequired, createFood)
router.delete('/delete/:food_id', authRequired, deleteFood)

router.post('/rate', authRequired, rateFood)
router.delete('delete-rate/:rate_id', authRequired, deleteRate)

router.get('/:food_id', authRequired, fetchFoodById)
router.get('/search/:search', authRequired, searchFood)

router.get('/ingredients/:search', authRequired, recomandationIngrName)
router.get('/pairing/ingredients', authRequired, recomendataionPairing)

module.exports = router