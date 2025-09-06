import { useEffect, useRef, useState, useId } from "react";
import { IoIosArrowDropleftCircle, IoMdSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {  useNavigate } from "react-router";
import { fetchChatHistory, sendMessage } from "../utils/chat/chat";
import moment from "moment";
import { socket } from "../socket";
import { setSelectedChat } from "../features/user";

const ChatInterface = ({ friendId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localChatId = useId()

  const { data: user, chats, chatId } = useSelector((state) => state.chat);
  const { userData } = useSelector((state) => state.user);
  const msgRef = useRef(null)
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");


  // Load chat history when id changes
  useEffect(() => {
    dispatch(fetchChatHistory(friendId));
    dispatch(setSelectedChat(friendId))
  }, [friendId, dispatch]);

  // Sync Redux chats → local messages
  useEffect(() => {
    setMessages(chats || []);
  }, [chats]);

  // Socket listener for real-time messages
  useEffect(() => {
    socket.emit("join", chatId ? chatId : localChatId)
    socket.on("message", (data) => {
      const { chatId: chat_id } = data
      console.log(data)
      if ((!chatId && localChatId === chat_id) || (chatId === chat_id)) {
        setMessages((prev) => [...prev, data])
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [user?._id, chatId, localChatId]);



  //useeffect for autoscrolling

  useEffect(() => {
    if (msgRef.current) {
      msgRef.current.scrollTop = msgRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending messages
  const handleMessageSend = () => {
    if (msg.trim() === "") return;


    const chat_id = chatId ? chatId : localChatId
    const newMsg = { from: userData._id, to: friendId, message: msg, createdAt: Date.now(), chatId: chat_id };
    socket.emit("join", chatId ? chatId : localChatId)
    socket.emit('message', newMsg)
    dispatch(sendMessage({ msg, senderId: friendId }));
    setMsg("");
  };


  return (
    <div className="w-full flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 sm:px-6 lg:px-10">
        <div className="flex items-center gap-2">
          <div
            onClick={() => navigate("/")}
            className="sm:hidden cursor-pointer hover:text-amber-500 active:scale-[0.90] duration-300 delay-75"
          >
            <IoIosArrowDropleftCircle size={27} />
          </div>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h2 className="font-semibold text-sm sm:text-base">{user?.name}</h2>
              <div className="text-xs text-gray-400 flex gap-1 items-center">
                {user?.isActive ? (
                  <div className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-green-400" />
                    <span>Active now</span>
                  </div>
                ) : (
                  `Active ${moment(user?.lastActive).fromNow()}`
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={msgRef} className="w-full  h-[75vh] sm:w-[80%] md:w-full xl:w-[80%] mx-auto overflow-y-auto no-scrollbar p-4 space-y-3">
        {messages.length > 0 ? (
          messages.map((chat, index) => (
            <div
              key={index}
              className={`w-full flex ${chat.from === user._id ? "justify-start" : "justify-end"
                }`}
            >
              <div
                className={`${chat.message.length > 50 ? 'xl:w-md' : 'w-fit'} px-4 py-2 rounded-xl  ${chat.from === userData._id
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-700 text-gray-100 rounded-bl-none"
                  }`}
              >
                {chat.message}
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-end ">
            <p className="text-lg sm:text-xl text-gray-500">
              No chat history found.
            </p>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="w-[90%] sm:w-[80%] xl:w-[60%] mx-auto border border-purple-700 flex gap-2 items-center rounded-sm px-2">
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 resize-none outline-none text-white"
        />
        <button
          onClick={handleMessageSend}
          disabled={msg.trim() === ""}
          className={`px-4 py-2 bg-purple-600 text-white ${msg.trim() === "" ? "cursor-not-allowed" : "cursor-pointer"
            } rounded-sm hover:bg-purple-700 transition-all duration-300 delay-75 flex items-center gap-2`}
        >
          <IoMdSend size={25} />
          <span className="hidden lg:block">Send</span>
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
