const User = require('../../models/User')
const jwt =  require('jsonwebtoken')
const bcrypt = require('bcrypt')
const ValidateEmail = require('../../utils/ValidateEmail')
const sendEmail =  require('../../utils/SendEmail')
const {JWT_SECRET, JWT_EXP, BASE_URL} = require('../../config')

const RegisterUser = async (req, res) => {
    try {
        const {first_name, last_name, email, password, username, avatar_url = ''} = req.body
        let error = {}

        if(!first_name || first_name.trim().length === 0){
            error.first_name = 'First name field must be require'
        }

        if(!last_name || last_name.trim().length === 0){
            error.last_name = 'Last name field must be require'
        }
        
        if(!email || email.trim().length === 0){
            error.email = 'Email field must be require'
        }

        if(!username || username.trim().length === 0){
            error.email = 'Username field must be require'
        }

        if(!password || password.trim().length === 0){
            error.password = 'Password field must be require'
        }

        if (password.trim().length <= 8){
            error.password = 'Password field must have more than 8 characters'
        }

        if(!ValidateEmail(email)){
            error.email = 'Email filed is invalid'
        }

        
        const user = await User.findOne({email})
        if (user) {
            error.email = 'Email already exists'
        }

        const user_username = await User.findOne({username})
        if (user_username) {
            error.username = 'Username has been used'
        }

        if(Object.keys(error).length){
            return res.status(422).json({error})
        }

        const hashPassword = await bcrypt.hash(password, 8)

        const registerUser = new User({
            first_name,
            last_name,
            username,
            email,
            password: hashPassword,
            avatar_url
        })

        const saveUser = await registerUser.save()

        const token = jwt.sign({userId: saveUser.id}, JWT_SECRET, {
            noTimestamp: true,
            expiresIn: JWT_EXP,
        })

        const emailMessage = `${BASE_URL}/api/auth/verify/${token}`
        await sendEmail(saveUser.email, 'Verify Email', emailMessage)

        return res.status(201).json({
            message: 'Your account has been resgistered. Now verify your email',
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: 'Something went wrong'
        })
    }

}


const VerifyEmail = async(req, res) => {
    try {
        payload = jwt.verify(req.params.token, JWT_SECRET)

        const user = await User.findById(payload.userId)

        if (user) {
            user.is_verified = true
            user.save()
        }

        return res.status(200).json({
            message: 'Email verify successfully'
        })
    }  catch (err) {
        console.log(err)
        return res.status(400).json({error: 'Something went wrong'})
     }
} 

module.exports = {RegisterUser, VerifyEmail}