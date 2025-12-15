import React, {useEffect} from 'react';
import {useTheme} from '@/hooks/useTheme';
import {appStore} from '@/appStore/appStore';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'error' | 'success' | 'warning' | 'info';
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'error',
}) => {
  const {actualTheme} = useTheme();
  const setMobileNavOpen = appStore(state => state.setMobileNavOpen);

  // Hide floating icons when modal is open
  useEffect(() => {
    if (isOpen) {
      setMobileNavOpen(true);
    } else {
      setMobileNavOpen(false);
    }
  }, [isOpen, setMobileNavOpen]);

  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'fa-circle-check',
          bgColor: 'bg-green-100',
          iconColor: 'text-green-600',
          borderColor: 'border-green-500',
        };
      case 'warning':
        return {
          icon: 'fa-triangle-exclamation',
          bgColor: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          borderColor: 'border-yellow-500',
        };
      case 'info':
        return {
          icon: 'fa-circle-info',
          bgColor: 'bg-blue-100',
          iconColor: 'text-blue-600',
          borderColor: 'border-blue-500',
        };
      case 'error':
      default:
        return {
          icon: 'fa-circle-xmark',
          bgColor: 'bg-red-100',
          iconColor: 'text-red-600',
          borderColor: 'border-red-500',
        };
    }
  };

  const {icon, bgColor, iconColor, borderColor} = getIconAndColor();

  const modalBg = actualTheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textColor = actualTheme === 'light' ? 'text-gray-800' : 'text-white';
  const textSecondary =
    actualTheme === 'light' ? 'text-gray-600' : 'text-gray-200';
  const closeBtn =
    actualTheme === 'light'
      ? 'text-gray-400 hover:text-gray-600'
      : 'text-gray-500 hover:text-gray-300';

  return (
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-modal-title">
      <div
        className={`animate-fadeIn relative w-full max-w-md rounded-lg ${modalBg} shadow-2xl`}
        onClick={e => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 ${closeBtn} transition-colors`}
          aria-label="Close modal">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${bgColor}`}>
            <i className={`fa-solid ${icon} text-3xl ${iconColor}`}></i>
          </div>

          {/* Title */}
          <h2
            id="alert-modal-title"
            className={`mb-3 text-center text-xl font-bold ${textColor}`}>
            {title}
          </h2>

          {/* Message */}
          <p className={`mb-6 text-center ${textSecondary}`}>{message}</p>

          {/* Button */}
          <button
            onClick={onClose}
            className={`w-full rounded-lg border-2 ${borderColor} py-3 font-semibold transition-all duration-200 hover:opacity-80 active:scale-95 ${iconColor}`}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
