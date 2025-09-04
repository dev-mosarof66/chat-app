import mongoose, { mongo } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim:true,
            lowercase: true,
            validator: {
                validate: function (email){
                    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                    return regex.test(email)
                }
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            validator: {
                validate: function (password) {
                    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                    return regex.test(password)
                },
                message: "Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",

            }
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        lastActive: {
            type: Date,
            default: null,
        },
        avatar: {
            type: String,
            default:null
        },
        chatHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Chat"
            }
        ],
        friends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    { timestamps: true }
);


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.methods.generateToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

const User = mongoose.model("User", userSchema);

export default User;
