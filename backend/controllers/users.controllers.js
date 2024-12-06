import User from "../models/user.model.js"

export const getProfile = async (req, res) => {
    try {
        const {userName} = req.params
        const user = await User.findOne({userName: userName})

        if(!user){
            return res.status(400).json({error: "User not Found"})
        }

        res.status(200).json(user)
    }
    catch(error) {
        console.log(`Error in getProfile Controller: ${error}`)
        res.status(500).json({error: "Internal Server Error"})
    }
}
