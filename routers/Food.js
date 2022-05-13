const router = require('express').Router()
const authRequired = require('../middleware/AuthMiddleware')
const {createFood, deleteFood, rateFood, deleteRate} = require('../controllers/food/FoodActions')
const { fetchFoodById, searchFood, recomandationIngrName, recomendataionPairing, fetchUserFood, fetchTrendingFood, fetchAllRate, fetchAllFood } = require('../controllers/food/FetchFoods')

router.post('/create', authRequired, createFood)
router.delete('/delete/:food_id', authRequired, deleteFood)

router.post('/rate', authRequired, rateFood)
router.delete('delete-rate/:rate_id', authRequired, deleteRate)

router.get('/foods/:food_id', authRequired, fetchFoodById)
router.get('/search/:search', authRequired, searchFood)
router.get('/search/', authRequired, fetchAllFood)

router.get('/ingredients/:search', authRequired, recomandationIngrName)
router.get('/pairing/ingredients', authRequired, recomendataionPairing)
router.get('/user-foods/:user_id',authRequired, fetchUserFood)
router.get('/trending', authRequired, fetchTrendingFood)
router.get('/rate/:food_id', authRequired, fetchAllRate)

module.exports = router