import {useRef, useEffect, type Dispatch, type SetStateAction} from 'react';

type LogoutModalProps = {
  setShowLogoutModal: Dispatch<SetStateAction<boolean>>;
  handleLogout: () => Promise<void>;
};

export const LogoutModal = ({
  setShowLogoutModal,
  handleLogout,
}: LogoutModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowLogoutModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowLogoutModal]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title">
      <div
        ref={modalRef}
        className="w-11/12 max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2
          id="logout-modal-title"
          className="mb-4 text-xl font-semibold text-gray-800">
          Confirm Logout
        </h2>
        <p className="mb-6 text-gray-600">Are you sure you want to logout?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowLogoutModal(false)}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95"
            aria-label="Cancel logout">
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-95"
            aria-label="Confirm logout">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
