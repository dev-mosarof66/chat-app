import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.js";

export const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name) {
            return res.status(401).json({ message: 'Fullname is required.', success: false, data: null });
        }
        if (!email) {
            return res.status(401).json({ message: 'Email is required.', success: false, data: null });
        }
        if (!password || !confirmPassword) {
            return res.status(401).json({ message: 'Password is required.', success: false, data: null });
        }
        if (password !== confirmPassword) {
            return res.status(401).json({ message: 'Passwords must be same.', success: false, data: null });
        }


        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "This email already in use." });

        const user = await User({
            name,
            email,
            password
        })

        await user.save({
            validateBeforeSave: false
        })


        return res.status(201).json({ message: "User registered successfully.", data: null, success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false, data: null });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;


        if (!email) {
            return res.status(401).json({ message: 'Email is required.', success: false, data: null });
        }
        if (!password) {
            return res.status(401).json({ message: 'Password is required.', success: false, data: null });
        }

        const user = await User.findOne({ email }).populate("friends")

        if (!user) {
            return res.status(401).json({ message: 'Inavlid credentials', success: false, data: null });
        }
        const isPasswordValid = user.matchPassword(password)
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Inavlid credentials', success: false, data: null });
        }
        const token = user.generateToken()

        res.cookie('token', token)
        user.isActive = true
        await user.save({
            validateBeforeSave: false
        })

        return res.status(201).json({
            message: 'Login successfull.',
            success: true,
            data: user
        });

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false, data: null });
    }
};


export const logoutUser = async (req, res) => {
    try {

        const id = req.user;

        if (!id)
            res.status(401).json({ message: "Login session expired.", success: false, data: null });

        const user = await User.findById(id)
        user.isActive = false;
        user.lastActive = Date.now()
        await user.save({
            validateBeforeSave: false
        })
        res.clearCookie("token");
        res.status(201).json({ message: "Logged out successfully", success: true, data: null });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false, data: null });
    }
};


export const updateUser = async (req, res) => {
    try {
        const id = req.user;
        console.log("inside the update profile..")

        if (!id)
            res.status(401).json({ message: "Login session expired.", success: false, data: null });


        const avatar = req.file.path
        const { password } = req.body
        console.log(avatar, password)
        let upload;

        if (avatar) {
            upload = cloudinary.uploader.upload(avatar, {
                folder: "avatars",
                resource_type: 'image',
                overwrite: true
            })
        }

        const updates = {
            password,
            avatar: upload ? (await upload).secure_url : null
        }

        const user = await User.findByIdAndUpdate(
            id,
            updates,
            {
                new: true
            }
        );

        await user.save({
            validateBeforeSave: false
        });

        res.status(201).json({
            message: 'User data updated successfully.',
            success: true,
            data: {
                name: user.name,
                email: user.email,
                active: user.active,
                lastActive: user.lastActive,
                chatHistory: user.chatHistory,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.log("error in update profile: ", error)
        res.status(500).json({ message: error.message, success: false, data: null });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const id = req.user;

        if (!id)
            res.status(401).json({ message: "Login session expired.", success: false, data: null });


        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: "Your are trying to access a null user.", data: null, success: false });

        res.json({ message: "User deleted successfully", data: null, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false, data: null });
    }
};


export const getMe = async (req, res) => {
    try {
        const id = req.user;

        if (!id)
            res.status(401).json({ message: "Login session expired.", success: false, data: null });

        const user = await User.findById(id).populate('friends', '-password -chatHistory -email -updatedAt -friends -__v')

        if (!user) return res.status(404).json({ message: "Your are trying to access a null user.", data: null, success: false });


        res.status(200).json({
            message: 'User data retreived successfully.',
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false, data: null });
    }
};


export const fetchAllUser = async (req, res) => {
    try {
        const id = req.user;
        // console.log("inside fetch all user")

        if (!id)
            res.status(401).json({ message: "Login session expired.", success: false, data: null });

        let allUsers = await User.find().select('-password -createdAt -updatedAt -email -friends -__v')

        allUsers = allUsers.filter((user) => user._id != id)

        res.status(200).json({
            message: 'User data retreived successfully.',
            success: true,
            data: allUsers
        });
    } catch (error) {
        console.log('sever error in fetching all user: ', error)
        res.status(500).json({ message: error.message, success: false, data: null });
    }
}



