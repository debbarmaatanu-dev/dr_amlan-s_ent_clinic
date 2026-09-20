import {useEffect, useState} from 'react';
import {useTheme} from '@/hooks/useTheme';
import {IMAGES} from '@/constants/images';

const SESSION_KEY = 'identity-announcement-acked';

/** Crawlers / preview bots — never mount the notice (keeps index + lab crawls clean). */
const isNonHumanClient = (): boolean => {
  if (typeof navigator === 'undefined') return true;
  const ua = navigator.userAgent;
  return /googlebot|google-inspectiontool|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|applebot|semrushbot|ahrefsbot|mj12bot|dotbot|petalbot|bytespider/i.test(
    ua,
  );
};

/**
 * Full-viewport identity notice above the nav stack.
 * - Once per browser session (sessionStorage); refresh keeps it dismissed.
 * - Skipped for known crawlers; deferred so hero can claim LCP first.
 * - position:fixed → does not shift document layout (CLS-safe).
 */
export const IdentityAnnouncementNotice = () => {
  const {actualTheme} = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isNonHumanClient()) return;

    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') return;
    } catch {
      // Private mode / blocked storage — still allow one show this load
    }

    // Defer past first paint / hero LCP window so this image is not LCP.
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const show = () => setVisible(true);

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(show, {timeout: 2800});
    } else {
      timeoutId = setTimeout(show, 1800);
    }

    return () => {
      if (
        idleId !== undefined &&
        typeof window.cancelIdleCallback === 'function'
      ) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  const acknowledge = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  const panelBg =
    actualTheme === 'light' ? 'bg-white' : 'bg-gray-900 ring-1 ring-gray-700';
  const okayBtn =
    actualTheme === 'light'
      ? 'bg-blue-700 text-white hover:bg-blue-800 focus-visible:ring-yellow-400'
      : 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:ring-yellow-300';
  const footerBg = actualTheme === 'light' ? 'bg-slate-50' : 'bg-gray-950';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-1 xxxxxs:p-1 xxxxs:p-1.5 xs:p-2 sm:p-2.5 md:p-3"
      role="dialog"
      aria-modal="true"
      aria-labelledby="identity-announcement-title"
      data-nosnippet>
      <div
        className={`flex max-h-[98dvh] w-full max-w-5xl flex-col overflow-hidden rounded-xl shadow-2xl ${panelBg}`}>
        <h2 id="identity-announcement-title" className="sr-only">
          Important announcement — Major Amlan Debbarma identity clarification
        </h2>

        <div className="min-h-0 w-full grow overflow-hidden">
          <img
            src={IMAGES.IDENTITY_ANNOUNCEMENT}
            alt="Important announcement: There are two ENT specialists named Dr. Amlan Debbarma. This clinic is Major Amlan Debbarma, Retd. Army Officer, ENT Surgeon and Allergist. Location near Lenskart between Sankar Chowmuhani and Bijoykumar Chowmuhani, Agartala. Appointments 6033521499."
            className="mx-auto h-auto max-h-[calc(98dvh-3rem)] w-full object-contain xxxxxs:max-h-[calc(98dvh-2.75rem)] xs:max-h-[calc(98dvh-3.25rem)] sm:max-h-[calc(98dvh-3.5rem)]"
            width={1200}
            height={675}
            decoding="async"
            loading="lazy"
            fetchPriority="low"
          />
        </div>

        <div
          className={`flex shrink-0 justify-center px-2 py-1.5 xxxxxs:py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-2 ${footerBg}`}>
          <button
            type="button"
            onClick={acknowledge}
            className={`min-h-9 cursor-pointer rounded-md px-5 py-1.5 text-sm font-semibold tracking-wide shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] xs:min-h-10 xs:px-6 xs:text-base sm:min-h-10 sm:rounded-lg sm:px-7 ${okayBtn}`}
            aria-label="Acknowledge important announcement and continue">
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};
