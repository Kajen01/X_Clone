import User from "../models/user.model.js"
import Post from "../models/post.model.js"

import cloudinary from "cloudinary"

export const createPost = async (req, res) => {
    try{
        const {text} = req.body
        let {img} = req.body

        const userId = req.body._id.toString()
        const user = await User.findOne({_id: userId})

        if(!user){
            return res.status(400).json({error: "User Not Found"})
        }

        if(!text && !img){
            return res.status(400).json({error: "Post must have Text or Image"})
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url
        }

        const newPost = new Post({
            user: userId,
            text: text,
            img: img
        })
        await newPost.save()

        res.status(201).json(newPost)
    }
    catch(error){
        console.log(`Error in createPost controller: ${error}`)
        res.status(500).json({error: "Internal Server Error"})
    }
}