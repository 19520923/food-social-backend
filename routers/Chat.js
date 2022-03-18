const router = require('express').Router()
const {createChatRoom, sendMessage, seenMessage} = require('../controllers/chat/ChatAction')
const { fetchAllChat , fetchAllMessage} = require('../controllers/chat/FetchChat')
const authRequired = require('../middleware/AuthMiddleware')

router.post('/create-chat/:user_id', authRequired, createChatRoom)
router.post('/send-message', authRequired, sendMessage)
router.post('/seen/:chat_id', authRequired, seenMessage)

router.get('/chats', authRequired, fetchAllChat)
router.get('/messages/:chat_id', authRequired, fetchAllMessage)

module.exports = router