const User = require('../../models/User')
 module.exports = async (req, res) => {
     try {
         const user = await User.findById(req.userId);
         if(user) {
             user.is_current = false;
             await user.save()

             const accountData = {
                 id: user.id,
                 username: user.username,
                 email: user.email,
                 avatar_url: user.avatar_url,
             }

             res.status(200).json({message: 'Logout successfully', accountData});

         } else {
             res.status(404).json({error: 'User not found'});
         }
     } catch (err) {
         console.log(err);
         return res.status(500).json({error: 'Something went wrong'})
     }
 }