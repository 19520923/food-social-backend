const Notification = require("../models/Notification");

module.exports = async ({
  receiver,
  content,
  destination = "",
  type = "SYSTEM",
  author,
  food_data,
  post_data,
}) => {
  const notification = new Notification({
    author: author,
    receiver: receiver,
    notify_type: type,
    destination: destination,
    content: content,
    food_data: food_data,
    post_data: post_data,
  });

  const savedNotif = await notification.save();

  return Notification.findById(savedNotif.id).populate(
    "author"
  );
};
