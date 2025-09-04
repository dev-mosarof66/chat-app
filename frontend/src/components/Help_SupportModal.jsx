import React from "react";
import { X } from "lucide-react";

const Help_SupportModal = ({ onclick }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 w-[90%] max-w-lg rounded-2xl shadow-lg p-6">
        
        {/* Header with title and close button */}
        <div className="w-full flex flex-row-reverse items-center justify-between">
          <button
            onClick={() => onclick(false)}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 cursor-pointer transition-all duration-300 delay-75"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Help & Support
          </h2>
        </div>

        {/* Content */}
        <div className="mt-2 text-gray-600 dark:text-gray-300 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          <p>
            If you encounter any issues or have questions, we’re here to help!
          </p>
          <p>
            1. Check our FAQs for quick answers to common questions.
          </p>
          <p>
            2. Contact our support team via email: <span className="font-medium">chatbot@gmail.com</span>
          </p>
          <p>
            3. Provide as much detail as possible when reporting a bug or issue, including screenshots if applicable.
          </p>
          <p>
            4. We strive to respond to all support requests within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Help_SupportModal;
