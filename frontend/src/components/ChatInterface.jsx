import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatHistory, sendMessage } from "../utils/chat/chat";
import { socket } from "../socket";
import { setSelectedChat } from "../features/user";
import { v4 as uuidv4 } from "uuid";

import ChatHeader from "./Header";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";

const ChatInterface = ({ friendId }) => {
  const dispatch = useDispatch();
  const localChatId = useMemo(() => uuidv4(), []);

  const { data: user, chats, chatId } = useSelector((state) => state.chat);
  const { userData } = useSelector((state) => state.user);

  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  // Load chat history when chat target changes
  useEffect(() => {
    dispatch(fetchChatHistory(friendId));
    dispatch(setSelectedChat(friendId));
  }, [friendId, dispatch]);

  // Initialize local messages from Redux (history only)
  useEffect(() => {
    if (chats) {
      setMessages(chats);
    }
  }, [friendId, chats]);

  // Socket listener for real-time replies (exclude my own)
  useEffect(() => {
    const id = chatId ? chatId : localChatId;
    socket.emit("join", id);

    const handleMessage = (data) => {
      if (
        ((!chatId && localChatId === data.chatId) || chatId === data.chatId) &&
        data.from !== userData._id
      ) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [chatId, localChatId, userData._id]);

  // Handle sending messages
  const handleMessageSend = () => {
    if (msg.trim() === "") return;

    const chat_id = chatId ? chatId : localChatId;
    const newMsg = {
      from: userData._id,
      to: friendId,
      message: msg,
      createdAt: Date.now(),
      chatId: chat_id,
    };

    // Show immediately in UI
    setMessages((prev) => [...prev, newMsg]);

    // Emit to socket
    socket.emit("message", newMsg);

    // Save to backend
    dispatch(sendMessage({ msg, receiverId: friendId }));

    setMsg("");
  };


  const handleFileSend = (file) => {
    const chat_id = chatId ? chatId : localChatId;

    const newMsg = {
      from: userData._id,
      to: friendId,
      message: "[File sent]", // you can replace with file.name or preview
      file,
      createdAt: Date.now(),
      chatId: chat_id,
    };

    // Show immediately in UI
    setMessages((prev) => [...prev, newMsg]);

    // Emit to socket (send metadata, actual upload would need backend handling)
    socket.emit("file", newMsg);

    // Optionally: dispatch upload API
    // dispatch(uploadFile({ file, receiverId: friendId }));
  };


  return (
    <div className="w-full flex flex-col h-full">
      <ChatHeader user={user} />
      <ChatHistory messages={messages} userData={userData} />
      <ChatInput
        msg={msg}
        setMsg={setMsg}
        handleMessageSend={handleMessageSend}
        handleFileSend={handleFileSend}
      />
    </div>
  );
};

export default ChatInterface;
