import mongoose, { mongo } from "mongoose";


const chatSchema = new mongoose.Schema(
  {

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        minLength:2
      },
    ],
    messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    }],
    lastMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Message'
    }
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
