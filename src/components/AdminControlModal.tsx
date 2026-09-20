import React, {useState, useEffect} from 'react';
import {ClipLoader} from 'react-spinners';
import {useTheme} from '@/hooks/useTheme';
import {useAppStore} from '@/appStore/appStore';
import {CLINIC_SCHEDULE_SUMMARY} from '@/constants/clinicSchedule';
import {
  controlClinicClosure,
  fetchProtectedClinicStatus,
  turnOnClinicBookings,
  type ProtectedClinicStatus,
} from '@/services/adminClinicApi';
import {
  isManuallyClosedOnDate,
  validateClinicClosureDates,
} from '@/utils/clinicControlHelpers';

interface AdminControlModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  const [currentStatus, setCurrentStatus] =
    useState<ProtectedClinicStatus | null>(null);

  const {actualTheme} = useTheme();
  const setMobileNavOpen = useAppStore(state => state.setMobileNavOpen);

  // Hide floating icons when modal is open
  useEffect(() => {
    setMobileNavOpen(isOpen);
    return () => {
      setMobileNavOpen(false);
    };
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

  const loadClinicStatus = async () => {
    const result = await fetchProtectedClinicStatus();
    if (!result.ok) return;
    setCurrentStatus(result.status);
    if (result.status.closedFrom) {
      setClosedFrom(result.status.closedFrom);
    }
    if (result.status.closedTill) {
      setClosedTill(result.status.closedTill);
    }
  };

  // Fetch current clinic status when the modal opens (external API sync).
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    void (async () => {
      const result = await fetchProtectedClinicStatus();
      if (cancelled || !result.ok) return;
      setCurrentStatus(result.status);
      if (result.status.closedFrom) {
        setClosedFrom(result.status.closedFrom);
      }
      if (result.status.closedTill) {
        setClosedTill(result.status.closedTill);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const validationError = validateClinicClosureDates(closedFrom, closedTill);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const result = await controlClinicClosure(closedFrom, closedTill || null);

    if (result.ok) {
      setSuccess(result.message);
      await loadClinicStatus();
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleTurnOnToday = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const result = await turnOnClinicBookings();

    if (result.ok) {
      setSuccess(result.message);
      setClosedFrom('');
      setClosedTill('');
      await loadClinicStatus();
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const showTurnOnToday = isManuallyClosedOnDate(currentStatus, today);

  if (!isOpen) return null;

  return (
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-control-modal-title">
      <div
        className={`w-full max-w-md rounded-2xl ${bgColor} p-6 shadow-2xl`}
        onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="admin-control-modal-title"
            className={`text-xl font-bold ${textColor}`}>
            Control Appointments
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md p-1 text-gray-500 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Close modal">
            <i className="fa-solid fa-times text-xl" aria-hidden="true"></i>
          </button>
        </div>

        {/* Current Status Display */}
        {currentStatus && (
          <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <h3 className="mb-2 font-semibold text-blue-500">
              Current Status:
            </h3>
            {currentStatus.isManuallyOverridden ? (
              <div className="text-sm text-blue-500">
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
              <p className="text-sm text-blue-500">
                Following default schedule: {CLINIC_SCHEDULE_SUMMARY}
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
        {showTurnOnToday && (
          <div className="mb-4">
            <button
              onClick={handleTurnOnToday}
              disabled={loading}
              className="w-full cursor-pointer rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50">
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
            className="w-full cursor-pointer rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50">
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
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md px-2 py-1 text-sm text-gray-500 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
