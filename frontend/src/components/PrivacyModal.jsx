import React from "react";
import { X } from "lucide-react";

const PrivacyModal = ({ onclick }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 w-[90%] max-w-lg rounded-2xl shadow-lg p-6">
        
        {/* Header with close button */}
        <div className="w-full flex flex-row-reverse items-center justify-between">
          <button
            onClick={() => onclick(false)}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 cursor-pointer transition-all duration-300 delay-75"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Privacy Policy
          </h2>
        </div>

        {/* Content */}
        <div className="mt-2 text-gray-600 dark:text-gray-300 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          <p>
            We value your privacy and are committed to protecting your personal
            information. This privacy policy explains how we collect, use, and
            safeguard your data when you use our services.
          </p>
          <p>
            1. We may collect basic user information such as name, email, and
            account preferences.
          </p>
          <p>
            2. Your data will only be used to improve your experience and will
            never be shared with third parties without your consent.
          </p>
          <p>
            3. You can request data deletion or account removal at any time by
            contacting our support team.
          </p>
          <p>
            By continuing to use our services, you agree to this privacy policy
            and its terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
