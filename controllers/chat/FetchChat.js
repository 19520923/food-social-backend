const Chat = require("../../models/Chat")
const Message = require("../../models/Message")
const FilterUserData = require("../../utils/FilterUserData")


exports.fetchAllChat = async (req, res) => {
    let page = parseInt(req.query.page || 0)
    let limit = 10

    try {
        const chats = await Chat.find({ $or: [
            {user_1: req.userId},
            {user_2: req.userId}
        ]})
        .sort({ created_at: -1 })
        .limit(limit)
        .skip(page * limit)
        .populate('user_1')
        .populate('user_2')

        const chatsData = chats.map((chat) => ({
            chat,
            lastMessage: getLastMessage(chat.id)
        }))

        const totalCount = await Chat.countDocuments({ $or: [
            {user_1: req.userId},
            {user_2: req.userId}
        ] })

        const paginationData = {
        currentPage: page,
        totalPage: Math.ceil(totalCount / limit),
        totalChats: totalCount,
        }
        res
        .status(200)
        .json({ chats: chatsData, pagination: paginationData })
    } catch (err) {
        console.log(err)
        return res.status(500).json({error:"Something went wrong"})
    }
    
}

const getLastMessage = async (chat_id) => {
    try {
        return lastMessage = await Message.findOne({chat: chat_id}, { sort: { 'created_at' : -1 } })
    } catch (err) {
        console.log(err)
        return null
    }
}

exports.fetchAllMessage = async (req, res) => {
    let page = parseInt(req.query.page || 0)
    let limit = 10

    try {
        const messages = await Message.find({ chat: req.params.chat_id })
        .sort({ created_at: -1 })
        .limit(limit)
        .skip(page * limit)
        .populate('author')

        const totalCount = await Message.countDocuments({ chat: req.params.chat_id })

        const paginationData = {
        currentPage: page,
        totalPage: Math.ceil(totalCount / limit),
        totalMessages: totalCount,
        }
        res
        .status(200)
        .json({ messages: messages, pagination: paginationData })
    } catch (err) {
        console.log(err)
        return res.status(500).json({error:"Something went wrong"})
    }

}