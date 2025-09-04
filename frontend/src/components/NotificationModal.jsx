import React from "react";
import { X } from "lucide-react";

const NotificationModal = ({ onclick }) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 w-[90%] max-w-md rounded-2xl shadow-lg p-6">
        <div className="w-full flex flex-row-reverse items-center justify-between">
          <button
            onClick={() => onclick(false)}
            className=" text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 cursor-pointer transition-all duration-300 delay-75"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Notifications
          </h2>
        </div>

        <div className="w-full flex items-center justify-center text-gray-600">
          <p>This portion is for future updatation</p>
        </div>

      </div>
    </div>
  );
};

export default NotificationModal;
