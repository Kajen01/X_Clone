import Notification from "../models/notification.model.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "cloudinary"

export const getProfile = async (req, res) => {
    try {
        const {userName} = req.params
        const user = await User.findOne({userName: userName})

        if(!user){
            return res.status(404).json({error: "User not Found"})
        }

        res.status(200).json(user)
    }
    catch(error) {
        console.log(`Error in getProfile Controller: ${error}`)
        res.status(500).json({error: "Internal Server Error"})
    }
}

export const followUnFollowUser = async (req, res) => {
    try {
        const {id} = req.params
        const userToModify = await User.findById({_id: id})

        const currentUser = await User.findById({_id: req.user._id})

        if(id === req.user._id){
            return res.status(400).json({error: "You can't unfollow or follow yourself"})
        }

        if(!userToModify || !currentUser) {
            return res.status(404).json({error: "User not found"})
        }

        const isFollowing = currentUser.following.includes(id)

        if(isFollowing){
            // Unfollow
            await User.findByIdAndUpdate({_id: id}, {$pull: {followers: req.user._id}})
            await User.findByIdAndUpdate({_id: req.user._id}, {$pull: {following: id}})
            res.status(200).json({message: "Unfollowed sucessfully"})
        }
        else{
            // Follow
            await User.findByIdAndUpdate({_id: id}, {$push: {followers: req.user._id}})
            await User.findByIdAndUpdate({_id: req.user._id}, {$push: {following: id}})
            // Sent notification
            const newNotification = new Notification({
                from: req.user._id,
                to: id,
                type: "follow",
            })
            await newNotification.save()
            res.status(200).json({message: "Followed sucessfully"})
        }
    }
    catch(error) {
        console.log(`Error in followUnFollowUser Controller: ${error}`)
        res.status(500).json({error: "Internal Server Error"})
    }
}

export const getSuggestedUsers = async (req, res) => {
    try{
        const userId = req.user._id
        const userFollowedByMe = await User.findById({_id: userId}).select("-password")
        const users = await User.aggregate([
            {
                $match: {
                    _id: {$ne: userId}
                }
            },
            {
                $sample: {
                    size: 10
                }
            }
        ])
        const filteredUsers = users.filter((user) => !userFollowedByMe.following.includes(user._id))
        const suggestedUsers = filteredUsers.slice(0,4)

        suggestedUsers.forEach((user) => (user.password = null))
        res.status(200).json(suggestedUsers)
    }
    catch(error){
        console.log(`Error in getSuggestedUsers Controller: ${error}`)
        res.status(500).json({error: "Internal Server Error"})
    }
}

export const updateUser = async (req, res) => {
    try{
        const userId = req.user._id
        const {userName, fullName, email, currentPassword, newPassword, bio, link} = req.body
        let {profileImg, coverImg} = req.body
        let user = await User.findById(userId)

        if(!user){
            return res.status(404).json({error: "User Not Found"})
        }

        if((!newPassword && currentPassword) || (newPassword && !currentPassword)){
            return res.status(400).json({error: "Please provide newPassword and currentPassword"})
        }

        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if(isMatch){
                return res.status(400).json({error: "Current password is incorrect"})
            }
            if(newPassword.length < 6){
                return res.status(400).json({error: "New password length should be in 6 characters"})
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)
            user.passwrod = hashedPassword
        }

        // if(profileImg){
        //     if(user.profileImg){
        //         await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0])
        //     }
        //     const uploadedResponse = await cloudinary.uploader.upload(profileImg)
        //     profileImg = uploadedResponse.secure_url
        // }

        // if(coverImg){
        //     if(user.coverImg){
        //         await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0])
        //     }
        //     const uploadedResponse = await cloudinary.uploader.upload(coverImg)
        //     coverImg = uploadedResponse.secure_url
        // }

        user.userName = userName || user.userName
        user.fullName = fullName || user.fullName
        user.email = email || user.email
        user.bio = bio || user.bio
        user.link = link || user.link

        user = await user.save()

        user.password = null
        return res.status(200).json(user)
    }
    catch(error){
        console.log(`Error in updateUser Controller: ${error}`)
        res.status(500).json({error: "Internal Server Error"})
    }
}
