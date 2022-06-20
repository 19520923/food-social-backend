const nodemailer = require("nodemailer");
const { HOST, USER, PASS } = require("../config");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: HOST,
      port: 587,
      secureConnection: false,
      auth: {
        user: USER,
        pass: PASS,
      },

      tls: {
        ciphers: "SSLv3",
      },
    });

    await transporter.sendMail({
      from: USER,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;
