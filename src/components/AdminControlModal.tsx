import React, {useState, useEffect} from 'react';
import {ClipLoader} from 'react-spinners';
import {useTheme} from '@/hooks/useTheme';
import {appStore} from '@/appStore/appStore';

interface AdminControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ClinicStatus {
  isManuallyOverridden: boolean;
  closedFrom?: string;
  closedTill?: string;
  message?: string;
}

export const AdminControlModal: React.FC<AdminControlModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [closedFrom, setClosedFrom] = useState<string>('');
  const [closedTill, setClosedTill] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<ClinicStatus | null>(null);

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

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Calculate max date (30 days from today for admin flexibility)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateString = maxDate.toISOString().split('T')[0];

  const bgColor = actualTheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textColor = actualTheme === 'light' ? 'text-gray-700' : 'text-gray-200';
  const inputBg = actualTheme === 'light' ? 'bg-white' : 'bg-gray-700';
  const inputBorder =
    actualTheme === 'light' ? 'border-gray-300' : 'border-gray-600';
  const inputText = actualTheme === 'light' ? 'text-gray-900' : 'text-white';

  // Fetch current clinic status
  useEffect(() => {
    if (isOpen) {
      void fetchClinicStatus();
    }
  }, [isOpen]);

  const fetchClinicStatus = async () => {
    try {
      const {auth} = await import('@/services/firebase');
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/protected/clinic-status`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      if (data.success) {
        setCurrentStatus(data.status);
        if (data.status.closedFrom) {
          setClosedFrom(data.status.closedFrom);
        }
        if (data.status.closedTill) {
          setClosedTill(data.status.closedTill);
        }
      }
    } catch (error) {
      console.error('Error fetching clinic status:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!closedFrom) {
      setError('Please select a "Closed From" date');
      setLoading(false);
      return;
    }

    // Validate dates
    if (closedTill && closedFrom > closedTill) {
      setError('"Closed Till" date must be after "Closed From" date');
      setLoading(false);
      return;
    }

    try {
      const {auth} = await import('@/services/firebase');
      const user = auth.currentUser;
      if (!user) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const token = await user.getIdToken(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/protected/control-clinic`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            closedFrom,
            closedTill: closedTill || null,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(
          closedTill
            ? `Clinic bookings closed from ${closedFrom} to ${closedTill}`
            : `Clinic bookings closed from ${closedFrom} until manually reopened`,
        );
        await fetchClinicStatus(); // Refresh status
      } else {
        setError(data.error || 'Failed to update clinic status');
      }
    } catch (error) {
      console.error('Error updating clinic status:', error);
      setError('Failed to update clinic status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTurnOnToday = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const {auth} = await import('@/services/firebase');
      const user = auth.currentUser;
      if (!user) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const token = await user.getIdToken(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/protected/turn-on-clinic`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        setSuccess('Clinic bookings turned on for today');
        setClosedFrom('');
        setClosedTill('');
        await fetchClinicStatus(); // Refresh status
      } else {
        setError(data.error || 'Failed to turn on clinic');
      }
    } catch (error) {
      console.error('Error turning on clinic:', error);
      setError('Failed to turn on clinic. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div
        className={`w-full max-w-md rounded-2xl ${bgColor} p-6 shadow-2xl`}
        onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className={`text-xl font-bold ${textColor}`}>
            Control Appointments
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700">
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        {/* Current Status Display */}
        {currentStatus && (
          <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <h3 className="mb-2 font-semibold text-blue-800 dark:text-blue-200">
              Current Status:
            </h3>
            {currentStatus.isManuallyOverridden ? (
              <div className="text-sm text-blue-700">
                <p>
                  <strong>Manually Closed</strong>
                </p>
                {currentStatus.closedFrom && (
                  <p>From: {currentStatus.closedFrom}</p>
                )}
                {currentStatus.closedTill ? (
                  <p>Till: {currentStatus.closedTill}</p>
                ) : (
                  <p>Till: Manually reopened</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-blue-700">
                Following default schedule (6:00 PM - 8:30 PM, Monday to
                Saturday)
              </p>
            )}
          </div>
        )}

        {/* Important Notice */}
        <div className="mb-4 rounded-lg bg-yellow-400 p-3">
          <h3 className="mb-2 font-semibold text-black">
            <i className="fa-solid fa-info-circle mr-2"></i>
            Important Notes:
          </h3>
          <div className="text-sm text-black">
            <p className="mb-2">
              <strong>• Existing Bookings:</strong> Pre-existing appointments
              will remain valid. Contact patients manually if needed.
            </p>
            <p>
              <strong>• Mid-Payment Protection:</strong> If a patient is paying
              when you close bookings, automatic refund will be initiated.
            </p>
          </div>
        </div>

        {/* Turn On Today Button (if currently closed) */}
        {currentStatus?.isManuallyOverridden &&
          currentStatus.closedFrom &&
          currentStatus.closedFrom <= today &&
          (!currentStatus.closedTill || currentStatus.closedTill >= today) && (
            <div className="mb-4">
              <button
                onClick={handleTurnOnToday}
                disabled={loading}
                className="w-full rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50">
                {loading ? (
                  <ClipLoader size={16} color="white" />
                ) : (
                  <>
                    <i className="fa-solid fa-power-off mr-2"></i>
                    Turn On Bookings for Today
                  </>
                )}
              </button>
            </div>
          )}

        <form onSubmit={handleSubmit}>
          {/* Closed From Date */}
          <div className="mb-4">
            <label className={`mb-2 block text-sm font-medium ${textColor}`}>
              Closed From <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={closedFrom}
              onChange={e => setClosedFrom(e.target.value)}
              min={today}
              max={maxDateString}
              className={`w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none ${inputBg} ${inputBorder} ${inputText}`}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Select today to close immediately
            </p>
          </div>

          {/* Closed Till Date */}
          <div className="mb-4">
            <label className={`mb-2 block text-sm font-medium ${textColor}`}>
              Closed Till (Optional)
            </label>
            <input
              type="date"
              value={closedTill}
              onChange={e => setClosedTill(e.target.value)}
              min={closedFrom || today}
              max={maxDateString}
              className={`w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none ${inputBg} ${inputBorder} ${inputText}`}
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty to close until manually reopened
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-800 dark:bg-red-900/20 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 rounded-lg bg-green-100 p-3 text-green-800 dark:bg-green-900/20 dark:text-green-200">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50">
            {loading ? (
              <ClipLoader size={16} color="white" />
            ) : (
              <>
                <i className="fa-solid fa-ban mr-2"></i>
                Close Clinic Bookings
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
