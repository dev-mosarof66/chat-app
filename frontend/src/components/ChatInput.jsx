import { IoMdSend } from "react-icons/io";
import { FaPaperclip } from "react-icons/fa";

const ChatInput = ({ msg, setMsg, handleMessageSend, handleFileSend }) => {
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSend(e.target.files[0]);
      e.target.value = "";
    }
  };

  return (
    <div className="w-[90%] sm:w-[80%] xl:w-[60%] mx-auto border border-purple-700 flex gap-2 items-center rounded-sm px-2">
      {/* File Upload */}
      <div className="relative">
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        <label
          htmlFor="file-input"
          className="cursor-pointer text-purple-400 hover:text-purple-600 active:scale-90 duration-150 flex items-center justify-center"
        >
          <FaPaperclip size={17} />
        </label>
      </div>

      {/* Message Input */}
      <textarea
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-3 py-2 resize-none outline-none text-white bg-transparent"
      />

      {/* Send Button */}
      <button
        onClick={handleMessageSend}
        disabled={msg.trim() === ""}
        className={`px-4 py-2 bg-purple-600 text-white ${
          msg.trim() === "" ? "cursor-not-allowed" : "cursor-pointer"
        } rounded-sm hover:bg-purple-700 transition-all duration-300 delay-75 flex items-center gap-2`}
      >
        <IoMdSend size={25} />
        <span className="hidden lg:block">Send</span>
      </button>
    </div>
  );
};

export default ChatInput;
