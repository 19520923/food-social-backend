module.exports = {
  PORT: process.env.PORT || 8800,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.5pm1i.mongodb.net/backend?retryWrites=true&w=majority',
  JWT_SECRET: process.env.JWT_SECRET || "itssecret",
  JWT_EXP: process.env.JWT_EXPIRE || '10h',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "19520923@gm.uit.edu.vn",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin",
  BASE_URL: process.env.BASE_URL || 'https://foodtalk-backend.herokuapp.com',
  // BASE_URL: process.env.BASE_URL || 'https://food-social-backend.vercel.app',
  HOST: 'smtp.gmail.com',
  USER: 'foodtalksocial@gmail.com',
  PASS: 'tan12022001',
}
