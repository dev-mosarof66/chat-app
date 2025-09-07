import { IoIosArrowDropleftCircle } from "react-icons/io";
import { useNavigate } from "react-router";
import moment from "moment";

const ChatHeader = ({ user }) => {
  const navigate = useNavigate();

  return (
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
            <h2 className="font-semibold text-sm sm:text-base">
              {user?.name}
            </h2>
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
  );
};

export default ChatHeader;
