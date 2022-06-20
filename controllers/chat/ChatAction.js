const Chat = require("../../models/Chat");
const FilterUserData = require("../../utils/FilterUserData");
const Message = require("../../models/Message");

exports.createChatRoom = async (req, res) => {
  try {
    const chatRoom = await Chat.findOne({
      $or: [
        { user_1: req.userId, user_2: req.params.user_id },
        { user_1: req.params.user_id, user_2: req.userId },
      ],
    })
      .populate("user_1")
      .populate("user_2");

    if (chatRoom) {
      return res.status(201).json({
        message: "existed",
        room: chatRoom,
      });
    }

    const room = new Chat({
      user_1: req.userId,
      user_2: req.params.user_id,
    });

    const saveRoom = await room.save();

    const roomData = await Chat.findById(saveRoom.id)
      .populate("user_1")
      .populate("user_2");

    return res.status(201).json({
      message: "created",
      room: roomData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chat, content, type = "TEXT" } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Content field must be require" });
    }

    const chatRoom = await Chat.findById(chat)
      .populate("user_1")
      .populate("user_2");

    if (!chatRoom) {
      return res.status(400).json({ error: "Chat room not found" });
    }

    const message = new Message({
      author: req.userId,
      chat,
      content,
      type,
    });

    const saveMessage = await message.save();

    chatRoom.lastMessage = saveMessage;

    await chatRoom.save();

    const messageData = await Message.findById(saveMessage.id).populate(
      "author"
    );

    if (chatRoom.user_1.socket_id) {
      req.io
        .to(chatRoom.user_1.socket_id)
        .emit("new-message", { data: messageData });
    }

    if (chatRoom.user_2.socket_id) {
      req.io
        .to(chatRoom.user_2.socket_id)
        .emit("new-message", { data: messageData });
    }

    return res.status(201).json({
      message: "Sent successfully",
      content: messageData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

exports.seenMessage = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chat_id)
      .populate("user_1")
      .populate("user_2");

    if (chat.user_1 === req.userId) {
      chat.is_user_1_seen = true;
      const saveChat = await chat.save();

      if (chat.user_2.socket_id) {
        req.io
          .to(chat.user_2.socketId)
          .emit("message-seen", { data: saveChat });
      }
    }

    if (chat.user_2 === req.userId) {
      chat.is_user_2_seen = true;
      const saveChat = await chat.save();

      if (chat.user_1.socket_id) {
        req.io
          .to(chat.user_1.socketId)
          .emit("message-seen", { data: saveChat });
      }
    }

    return res.status(200).json({ message: "Seen" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
