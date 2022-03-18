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

        const filterChat = chats.map((chat) => ({
            id: chat.id,
            user_1: FilterUserData(chat.user_1),
            user_2: FilterUserData(chat.user_2),
            is_user_1_seen: chat.is_user_1_seen,
            is_user_2_seen: chat.is_user_2_seen,
            created_at: chat.created_at
        }))
        const totalCount = await Chat.countDocuments({ $or: [
            {user_1: req.userId},
            {user_2: req.userId}
        ] })

        const paginationData = {
        currentPage: page,
        totalPage: Math.ceil(totalCount / limit),
        totalComments: totalCount,
        }
        res
        .status(200)
        .json({ chats: filterChat, pagination: paginationData })
    } catch (err) {
        console.log(err)
        return res.status(500).json({error:"Something went wrong"})
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

        const filterMessage = messages.map((message) => ({
            id: message.id,
            content: message.content,
            type: message.type,
            author: FilterUserData(message.author),
            chat: message.chat,
            created_at: message.created_at
        }))
        const totalCount = await Message.countDocuments({ chat: req.params.chat_id })

        const paginationData = {
        currentPage: page,
        totalPage: Math.ceil(totalCount / limit),
        totalComments: totalCount,
        }
        res
        .status(200)
        .json({ messages: filterMessage, pagination: paginationData })
    } catch (err) {
        console.log(err)
        return res.status(500).json({error:"Something went wrong"})
    }

}