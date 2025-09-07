import { useEffect, useRef } from "react";

const ChatHistory = ({ messages, userData }) => {
  const msgRef = useRef(null);

  // Auto-scroll (only if near bottom)
  useEffect(() => {
    if (msgRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = msgRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      if (isNearBottom) {
        msgRef.current.scrollTop = scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div
      ref={msgRef}
      className="w-full h-[75vh] sm:w-[80%] md:w-full xl:w-[80%] mx-auto overflow-y-auto no-scrollbar p-4 space-y-3"
    >
      {messages.length > 0 ? (
        messages.map((chat, index) => (
          <div
            key={index}
            className={`w-full flex ${
              chat.from === userData?._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${
                chat.message.length > 50 ? "max-w-md" : "w-fit"
              } px-4 py-2 rounded-xl ${
                chat.from === userData._id
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-700 text-gray-100 rounded-bl-none"
              }`}
            >
              {chat.message}
            </div>
          </div>
        ))
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-end">
          <p className="text-lg sm:text-xl text-gray-500">
            No chat history found.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
