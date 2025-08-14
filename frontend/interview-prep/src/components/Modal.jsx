import React from "react";

const Modal = ({ children, isOpen, onClose, title, hideHeader }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out">
      {/* Modal container with animation */}
      <div className="relative w-full mx-4 sm:mx-6 max-w-lg bg-white rounded-2xl shadow-xl animate-scaleIn overflow-hidden">
        
        {/* Modal Header */}
        {!hideHeader && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-orange-100 rounded-full p-1.5 transition"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
