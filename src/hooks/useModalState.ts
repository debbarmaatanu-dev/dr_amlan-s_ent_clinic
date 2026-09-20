import {useEffect} from 'react';
import {useAppStore} from '@/appStore/appStore';

/**
 * Custom hook for modal state management
 * Handles mobile navigation state when modal is open/closed
 */
export const useModalState = (isOpen: boolean) => {
  const setMobileNavOpen = useAppStore(state => state.setMobileNavOpen);

  // Hide floating icons when modal is open
  useEffect(() => {
    if (isOpen) {
      setMobileNavOpen(true);
    } else {
      setMobileNavOpen(false);
    }
  }, [isOpen, setMobileNavOpen]);
};
