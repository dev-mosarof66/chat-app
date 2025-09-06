import { io } from "../app.js";
import Chat from "../models/chat.js";
import Message from "../models/message.js";
import User from "../models/user.js";
import mongoose, { mongo } from "mongoose";

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



// flow chat  => get userId and senderId => check if any previous chat history exist , if yes => get that history and push the new message and send response to the user
// if no => then create a new chat using this id's and set the new messages and return response to user.

export const sendMessage = async (req, res) => {
    try {
        console.log("inside the send message")
        const userId = req.user

        if (!userId) {
            return res.status(400).json({ message: "Login session expired." });
        }
        const { message, to } = req.body;
        console.log(message, to)

        if (!message) {
            return res.status(400).json({ message: "Message can't be empty." });
        }
        if (!to) {
            return res.status(400).json({ message: "Please select a user to start conversation." });
        }

        // TODO: implement file handling using imagekit or multer cloudinary
        // const file = req.file?.path;

        const user = await User.findById(userId)
        const friend = await User.findById(to)


        const existingChat = await Chat.findOne({
            participants: { $all: [new mongoose.Types.ObjectId(userId), new mongoose.Types.ObjectId(to)] }
        })


        if (existingChat) {
            const newMessage = await Message({
                from: userId,
                chatId: existingChat._id,
                to,
                message,
            });

            existingChat.messages.push(newMessage._id)

            await newMessage.save({
                validateBeforeSave: false
            })

            existingChat.lastMessageId = newMessage._id


            await existingChat.save({
                validateBeforeSave: false
            })
            const SendChat = await Chat.findById(existingChat._id).populate("messages")

            console.log('chat already exist between these user : ', SendChat)

            return res.status(201).json(SendChat);
        }


        const chat = new Chat({ participants: [userId, to], messages: [] });

        if (!chat) {
            return res.status(404).json({ message: "Error while creating new chat." });
        }

        const newMessage = await Message({
            from: userId,
            chatId: chat._id,
            to,
            message,
        });
        await newMessage.save({
            validateBeforeSave: false
        })

        chat.messages.push(newMessage._id)

        chat.lastMessageId = newMessage._id;
        await chat.save({
            validateBeforeSave: false
        })




        user.friends = Array.from(new Set([...user.friends, to]));
        friend.friends = Array.from(new Set([...friend.friends, userId]));
        user.chatHistory = Array.from(new Set([...user.chatHistory, chat._id]))
        friend.chatHistory = Array.from(new Set([...friend.chatHistory, chat._id]))
        await user.save({ validateBeforeSave: false });
        await friend.save({ validateBeforeSave: false });



        const SendChat = await Chat.findById(chat._id).populate("messages")
        console.log('new chat created between these user : ', SendChat)


        // io.to(to).emit('receiveMessage', newMessage)
        // io.to(userId).emit("receiveMessage", newMessage);

        return res.status(201).json(SendChat);
    } catch (error) {
        console.log("server error in send message controller : ", error)
        return res.status(500).json({ message: error.message });
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


// userid and friendid => find all chats between these two ids => then there is messages inside this chat => just return these messages
export const fetchChats = async (req, res) => {
    try {
        console.log('inside fetch chat history')
        const userId = req.user
        if (!userId) {
            return res.status(400).json({ message: "Login session expired." });
        }
        const { id: friendId } = req.params;
        console.log(userId, friendId)
        if (!friendId) {
            return res.status(400).json({ message: "No friends with this id." });

        }

        // first use of mongodb aggregation pipeline to fetch friend data,chatHistory and lastMessage

        const result = await Chat.aggregate([
            //first pipeline to fetch the chatHistory using userId and friendId
            {
                $match: {
                    participants: {
                        $all: [
                            new mongoose.Types.ObjectId(userId),
                            new mongoose.Types.ObjectId(friendId)
                        ]
                    }
                }
            },
            //second : fetch all the messages for this chat
            {
                $lookup: {
                    from: "messages",
                    localField: "_id",
                    foreignField: 'chatId',
                    as: "messages"
                }
            },
            //five : lookup for the last message
            {
                $lookup: {
                    from: "messages",
                    localField: "lastMessageId",
                    foreignField: '_id',
                    as: "lastMessage"
                }
            },
            //six => project all the fields that are required.
            {
                $project: {
                    messages: 1,
                    lastMessage: 1,

                }
            }
        ])

        if (!result) {
            return res.status(400).json({ message: 'Error while aggregating pipeline' });
        }

        const friendInfo = await User.findById(friendId).select('-password -email -updatedAt -chatHistory -friends -__v')
        console.log('result after aggregation and friend info ', result, friendInfo)

        return res.status(201).json({
            data: {
                messages: result,
                user: friendInfo
            }
        });
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


