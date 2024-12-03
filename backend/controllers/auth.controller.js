import User from "../models/user.model.js"
import generateToken from "../utils/generateToken.js"
import bcrypt from "bcryptjs"

const signup = async (req, res) => {
    try {
        const { userName, fullName, email, password } = req.body

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid Email Format" });
        }

        const existingEmail = await User.findOne({ email: email })
        const existingUnserName = await User.findOne({ userName: userName })

        if (existingEmail || existingUnserName) {
            return res.status(400).json({ error: "Already Existing User or Email" })
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must have atleast 6 char length" })
        }

        // Hashing the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            userName: userName,
            fullName: fullName,
            email: email,
            password: hashedPassword
        })

        if (newUser) {
            // Generate jwt and send cookie with response
            generateToken(newUser._id, res)
            await newUser.save()
            // res.ststus(200).json({message: "User created Sucessfully"})
            // For testing with postman
            res.status(200).json({
                _id: newUser._id,
                userName: newUser.userName,
                fullName: newUser.fullName,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profilImg: newUser.profilImg,
                coverImg: newUser.coverImg,
                bio: newUser.bio,
                link: newUser.link
            })
        }
        else {
            res.status(400).json({ error: "Invalid User Data" })
        }

    }
    catch {
        console.log(`Error in signup controller: ${error}`)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

const login = async (req, res) => {
    try{
        const {userName, password} = req.body
        const user = await user.findOne({userName: userName})

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid Username or Password"})
        }

        generateToken(user._id, res)

        // res.ststus(200).json({message: "User Login Sucessfully"})
        // For testing with postman
        res.status(200).json({
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profilImg: user.profilImg,
            coverImg: user.coverImg,
            bio: user.bio,
            link: user.link
        })

    }
    catch(error){
        console.log(`Error in Login Controller: ${error}`)
        return res.status(500).json({error: "Internal Server Error"})
    }
}

const logout = (req, res) => {
    res.send("logout")
}


export { signup, login, logout }