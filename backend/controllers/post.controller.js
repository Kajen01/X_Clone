import User from "../models/user.model.js"
import Post from "../models/post.model.js"

import cloudinary from "cloudinary"

export const createPost = async (req, res) => {
    try{
        const {text} = req.body
        let {img} = req.body

        const userId = req.user._id
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
            text: text || "",
            img: img || null
        })
        await newPost.save()

        res.status(201).json(newPost)
    }
    catch(error){
        console.log(`Error in createPost controller: ${error}`)
        res.status(500).json({error: "Internal Server Error"})
    }
}

export const deletePost = async (req, res) => {
    try {
        const {id} = req.params

        const post = await Post.findOne({_id: id})
        if(!post) {
            return res.status(404).json({error: "Post Not Found"})
        }

        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error: "You are not authorized to delete the post"})
        }

        if(post.img){
            const imgId = post.img.split('/').pop().split('.')[0]
            await cloudinary.uploader.destroy(imgId)
        }

        await post.findByIdAndDelete({_id: id})
        res.status(200).json({message: "Post deleted sucessfully"})
    }
    catch(error){
        console.log(`Error in deletePost Controller: ${error}`)
        res.status(500).json({error: "Internal Server Error"})
    }
}



