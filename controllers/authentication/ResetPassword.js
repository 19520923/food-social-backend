const User = require("../../models/User");
const bcrypt = require("bcrypt");
const ValidateEmail = require("../../utils/ValidateEmail");
const SendEmail = require("../../utils/SendEmail");

exports.changePassword = async (req, res) => {
  let { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.userId);
    let matchPassword = await bcrypt.compare(currentPassword, user.password);
    if (!matchPassword) {
      return res
        .status(400)
        .json({ error: "Current password is incorrect please try again" });
    }

    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    if (matchPassword === newPassword) {
      return res
        .status(400)
        .json({ error: "New password must different current password" });
    }

    let generatePasswordHash = await bcrypt.hash(newPassword, 8);
    user.password = generatePasswordHash;
    await user.save();
    res
      .status(200)
      .json({ message: "Your password has been updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

exports.resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email || email.trim().length === 0) {
      return res.status(400).json({ error: "Email field must be require" });
    }

    if (!ValidateEmail(email)) {
      return res.status(400).json({ error: "Email field must be valid" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Not found your account" });
    }

    const pad = "00000000";
    const randomPassword = Math.floor(Math.random() * 10000000 + 1).toString();
    const newPassword =
      pad.substring(0, pad.length - randomPassword.length) + randomPassword;

    await SendEmail({
      email: email,
      subject: "Reset password TALK FOOD account",
      text: `New password for email ${email} is: ${newPassword}`,
    });

    const hashPassword = await bcrypt.hash(newPassword, 8);
    user.password = hashPassword;
    await user.save();

    return res.status(200).json({
      message: "Reset password successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
