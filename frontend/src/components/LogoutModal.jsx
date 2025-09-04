import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../utils/user/user";
import { useNavigate } from 'react-router'

const LogoutModal = ({ onclick }) => {
  const {  logoutUserLoading } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = async () => {
    dispatch(logoutUser())
    navigate('/')
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 w-[90%] max-w-md rounded-2xl shadow-lg p-6">

        {/* Header */}
        <div className="w-full flex flex-row-reverse items-center justify-between">
          <button
            onClick={() => onclick(false)}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 cursor-pointer transition-all duration-300 delay-75"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Logout
          </h2>
        </div>

        {/* Content */}
        <div className="mt-2 text-gray-600 dark:text-gray-300">
          <p>Are you sure you want to logout from your account?</p>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => onclick(false)}
            className="px-4 py-2 rounded-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="w-18  rounded-sm bg-red-600 hover:bg-red-700 text-white transition cursor-pointer"
          >
            {
              logoutUserLoading ? <span className="loading loading-spinner loading-xs"></span>
                : "Logout"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
