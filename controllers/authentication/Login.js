const User = require('../../models/User')
const jwt =  require('jsonwebtoken')
const bcrypt = require('bcrypt')
const ValidateEmail = require('../../utils/ValidateEmail')
const {JWT_SECRET, JWT_EXP} = require('../../config')

module.exports = async (req, res) => {
    const {email, password} = req.body
    let error = {}

    if(!ValidateEmail(email)){
        error.email = 'Email address should be valid';
    }

    if(!email || email.trim().length === 0){
        error.email = 'Email must be required'
    }

    if(password.trim().length < 8) {
        error.password = 'Email must be have more than 8 character'
    }

    if( Object.keys(error).length){
        return res.status(422).json({error})
    }

    try {
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json ({
                error: 'Email not found'
            })
        }

        if(!user.is_active){
            return res.status(400).json({
                error: 'User is unactivate, please contact adminstator'
            })
        }

        if(!user.is_verified){
            return res.status(400).json({error: 'Account must be verify'})
        }

        const verifiedPassword = await bcrypt.compare(password, user.password)

        if(!verifiedPassword){
            return res.status(400).json(
                {error: 'Password not correct'}
            )
        }

        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET,{
            expiresIn: JWT_EXP
        })

        user.is_current = true
        user.last_login = Date.now()
        await user.save()

        return res.status(201).json({
            message: 'Login successfully',
            data:{
                token
            }
        })
    } catch (error){
        console.log(error)
        return res.status(500).json({error: "Something went wrong"})
    }
}