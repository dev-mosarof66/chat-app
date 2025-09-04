import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat",
        required:true
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default:null
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default:null,
      requred:true
    },
    message: {
      type: String,
      required: true,
    },
    file: { type: String, default: null },
    image:{type:String,default:null},
    video:{type:String,default:null},
    //reactions will added lates
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message',messageSchema)
export default Message