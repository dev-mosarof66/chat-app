import { io } from "../app.js";
import Chat from "../models/chat.js";
import User from "../models/user.js";
import mongoose from "mongoose";

export const createChat = async (req, res) => {
    try {
        const userId = req.user;
        if (!userId) {
            return res.status(401).json({ message: "Login session expired.", success: false, data: null });
        }

        const { id: friendId } = req.params;

        if (!friendId) {
            return res.status(401).json({ message: "Choose at least one friend to start conversation." });
        }

        const user = await User.findById(userId).select('-password');
        const friend = await User.findById(friendId).select('-password');

        const existingChat = await Chat.findOne({
            participants: { $all: [new mongoose.Types.ObjectId(userId), new mongoose.Types.ObjectId(friendId)] }
        });

        if (existingChat) {
            const friendData = await User.findById(friendId).select('-password -chatHistory -friends');
            const userData = {
                user: friendData,
                chats: existingChat.messages,
                chatId: existingChat._id
            };
            return res.status(200).json(userData);
        }

        const chat = new Chat({ participants: [userId, friendId], messages: [] });
        await chat.save();


        user.friends = Array.from(new Set([...user.friends, friendId]));
        friend.friends = Array.from(new Set([...friend.friends, userId]));
        user.chatHistory = Array.from(new Set([...user.chatHistory, chat._id]))
        friend.chatHistory = Array.from(new Set([...friend.chatHistory, chat._id]))
        await user.save({ validateBeforeSave: false });
        await friend.save({ validateBeforeSave: false });

        const frnd = await User.findById(friendId).select('-password -chatHistory -friends');
        const userData = {
            user: frnd,
            chats: chat.messages,
            chatId: existingChat._id

        };

        res.status(201).json(userData);
    } catch (error) {
        console.log('error in creating new chat', error);
        res.status(500).json({ message: error.message });
    }
};


export const sendMessage = async (req, res) => {
    try {
        console.log("inside the send message")
        const userId = req.user

        if (!userId) {
            return res.status(400).json({ message: "Login session expired." });
        }
        const { id: chatId } = req.params;
        console.log(chatId)

        if (!chatId) {
            return res.status(400).json({ message: "No previous chat history found." });
        }
        const { message, to } = req.body;
        console.log(message, to)

        // TODO: implement file handling using imagekit or multer cloudinary
        // const file = req.file?.path;

        if (!message) {
            return res.status(400).json({ message: "Message can't be empty." });
        }
        if (!to) {
            return res.status(400).json({ message: "Please select a user to start conversation." });
        }



        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        const newMessage = {
            from: userId,
            to,
            message,
        };



        chat.messages.push(newMessage);
        await chat.save({
            validateBeforeSave: false
        });

        io.to(to).emit('receiveMessage', newMessage)
        io.to(userId).emit("receiveMessage", newMessage);

        console.log('all way down.')
        res.status(201).json(chat);
    } catch (error) {
        console.log("server error in send message controller : ", error)
        res.status(500).json({ message: error.message });
    }
};


export const deleteMessage = async (req, res) => {
    try {
        const userId = req.user

        if (!userId) {
            return res.status(400).json({ message: "Login session expired." });
        }
        const { chatId, messageId } = req.params;

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: "No chat history with this user." });

        const msgIndex = chat.messages.findIndex(msg => msg._id.toString() === messageId);
        if (msgIndex === -1) return res.status(404).json({ message: "You are requesting an invalid field." });

        chat.messages = chat.messages.filter((msg) => msg._id !== messageId)
        await chat.save({
            validateBeforeSave: false
        });

        res.status(201).json({ message: "Message deleted successfully.", chat });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await Chat.findByIdAndDelete(chatId);
        if (!chat) return res.status(404).json({ message: "No chat history with this user." });

        res.status(200).json({ message: "Chat deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const fetchChats = async (req, res) => {
    try {
        const userId = req.user
        if (!userId) {
            return res.status(400).json({ message: "Login session expired." });
        }
        const { id: friendId } = req.params;

        if (!friendId) {
            return res.status(400).json({ message: "No friends with this id." });

        }
        const friend = await User.findById(friendId).select('-password -chatHistory -updatedAt -createdAt -friends')
        const existingChat = await Chat.findOne({
            participants: { $all: [new mongoose.Types.ObjectId(userId), new mongoose.Types.ObjectId(friendId)] }
        });

        if (!existingChat) {
            const userData = {
                user: friend,
                chats: []
            }
            return res.status(201).json({ data: userData });
        }

        const userData = {
            user: friend,
            chats: existingChat.messages,
            chatId: existingChat._id

        }

        return res.status(201).json({ data: userData });
    } catch (error) {
        console.log('error in fetch friends data', error)
        return res.status(500).json({ message: error.message });
    }
}
export const fetchLastMessage = async (req, res) => {
    try {
        const userId = req.user
        if (!userId) {
            return res.status(400).json({ message: "Login session expired." });
        }
        const { id: friendId } = req.params;

        if (!friendId) {
            return res.status(400).json({ message: "No friends with this id." });

        }

        const existingChat = await Chat.findOne(
            {
                participants: { $all: [new mongoose.Types.ObjectId(userId), new mongoose.Types.ObjectId(friendId)] }
            },
            {
                messages: {
                    $slice: -1
                }
            }
        );

        if (!existingChat) {
            return res.status(201).json({ data: null });
        }


        return res.status(201).json({ data: existingChat.messages[0] });
    } catch (error) {
        console.log('error in fetch friends data', error)
        return res.status(500).json({ message: error.message });
    }
}


