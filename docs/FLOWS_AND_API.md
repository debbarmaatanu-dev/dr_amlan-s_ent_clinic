# User flows and backend API

The frontend and backend are separate Vercel projects. Browser requests use `VITE_API_BACKEND_URL` as the backend origin; the backend routes below are mounted by its `src/index.ts`. A request is subject to the backend's CORS, geolocation, size, and rate-limit middleware before reaching a route.

## Patient appointment and payment

```mermaid
sequenceDiagram
  participant Browser as Frontend browser
  participant Backend as Express backend
  participant DB as Firestore
  participant Pay as PhonePe
  Browser->>Backend: GET /api/appointment/available-slots?date=...
  Backend->>DB: Read appointment_bookings for date
  DB-->>Backend: Existing bookings
  Backend-->>Browser: availableSlots
  Browser->>Backend: POST /api/payment/create-order
  Backend->>DB: Validate closure and remaining slots
  Backend->>Pay: Create payment order
  Backend->>DB: Save pending booking
  Backend-->>Browser: redirectUrl
  Browser->>Pay: Navigate to checkout
  Pay-->>Browser: Return to /appointment?payment=callback&transaction_id=...
  Browser->>Backend: GET webhook-status; status-by-transaction if needed
  Backend->>Pay: Check status if needed
  Backend->>DB: Confirm booking if paid and clinic remains open
  Backend-->>Browser: Booking data or failure
```

The date is first checked by [`clinicSchedule.ts`](../src/constants/clinicSchedule.ts), then the page reads the slot count through [`appointmentService.ts`](../src/services/appointmentService.ts). The form also validates patient fields. `create-order` sends date, name, gender, age, phone, and a fixed amount of ₹400. The backend repeats schedule, amount, phone, clinic-closure, and slot checks before creating a PhonePe order and a pending booking. The frontend then navigates to the returned checkout URL.

On return to `/appointment`, the frontend reads the transaction ID, checks whether a webhook already processed the payment, and falls back to `status-by-transaction`. A successful response is mapped to receipt data and the slot count is refreshed. The backend's booking transaction, not the browser's 30-second cache, assigns the final slot.

PhonePe webhooks are a separate server-to-server path: `api/payment/webhook.js` on the frontend Vercel project forwards the POST body and Authorization header to backend `POST /payment/webhook`. The backend validates and processes it, records webhook state, and handles duplicate notifications. `api/payment/webhook-test.js` is a test proxy. The proxy uses the server-only `BACKEND_URL` and optional `WEBHOOK_ENDPOINT_PATH` variables; they are distinct from `VITE_API_BACKEND_URL`.

## Appointment lookup and admin operations

Patients can search by phone number and date through [`appointmentSearchApi.ts`](../src/services/appointmentSearchApi.ts). The backend reads `appointment_bookings` and returns either one booking for a receipt or several bookings for a selection table. The frontend maps a selected table row to receipt data in [`bookingMappers.ts`](../src/utils/bookingMappers.ts).

Admins sign in with Firebase Google popup auth. [`AuthWrapper.tsx`](../src/AuthWrapper.tsx) exposes a user in client state only when the email matches the `VITE_FIREBASE_ADMIN_EMAIL1/2` allowlist. For protected requests, [`authHeaders.ts`](../src/services/authHeaders.ts) gets a fresh Firebase ID token and sends `Authorization: Bearer <token>`. The backend independently verifies the token with Firebase Admin and checks `ADMIN_EMAIL1/2`. The frontend email check alone does not grant API access.

The admin download modal retrieves bookings for a chosen date. The admin control modal reads protected clinic status, posts a closure range, or turns bookings on for today. The public clinic status endpoint feeds the navbar and appointment page; protected clinic endpoints drive admin controls. A manual closure is separate from the regular weekly schedule.

## API map

All paths in this table are on the **backend origin**, except the final two proxy paths. JSON responses use `success` for application-level status; callers also handle fetch/parse failures.

| Method and path                                         | Frontend caller                             | Main response/use                                                 |
| ------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------- |
| `GET /api/appointment/available-slots?date=YYYY-MM-DD`  | `appointmentService.checkAvailableSlots`    | `availableSlots`; 30-second browser cache                         |
| `GET /api/appointment/clinic-status`                    | `appStore/clinicSlice`                      | Public manual-closure status and banner message                   |
| `POST /api/appointment/search`                          | `appointmentSearchApi.searchAppointments`   | `booking` or `bookings` for receipt lookup                        |
| `POST /api/payment/create-order`                        | `appointmentService.initiatePayment`        | `redirectUrl` for PhonePe checkout                                |
| `GET /api/payment/webhook-status/:transactionId`        | `appointmentService.resolvePaymentCallback` | Whether a webhook has processed the transaction                   |
| `GET /api/payment/status-by-transaction/:transactionId` | `appointmentService.resolvePaymentCallback` | Payment status and booking details                                |
| `GET /api/protected/bookings/:date`                     | `adminBookingsApi.fetchAdminBookings`       | Date's bookings; Firebase bearer token required                   |
| `GET /api/protected/clinic-status`                      | `adminClinicApi.fetchProtectedClinicStatus` | Admin clinic-control state; bearer token required                 |
| `POST /api/protected/control-clinic`                    | `adminClinicApi.controlClinicClosure`       | Set `closedFrom` and optional `closedTill`; bearer token required |
| `POST /api/protected/turn-on-clinic`                    | `adminClinicApi.turnOnClinicBookings`       | Turn bookings on for today; bearer token required                 |
| `POST /api/payment/webhook`                             | PhonePe to frontend Vercel proxy            | Forwarded to backend `POST /payment/webhook`                      |
| `GET/POST /api/payment/webhook-test`                    | Proxy connectivity checks                   | Forwarded to backend `/payment/webhook-test`                      |

The backend implementation is in the sibling `dr_amlan-s_ent_clinic_backend` repository: `src/routes/appointmentRoutes.ts`, `paymentRoutes.ts`, `protected.ts`, and `webhookRoutes.ts`. Its `src/services/bookingService.ts` and `phonePeService.ts` own final booking and payment work.

## Configuration across deployments

| Location                  | Variables or setting                                | Purpose                                                                 |
| ------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------- |
| Frontend Vite build       | `VITE_API_BACKEND_URL`                              | Backend base URL embedded in browser JavaScript                         |
| Frontend Vite build       | `VITE_FIREBASE_*`                                   | Firebase web-app configuration and client admin UI allowlist            |
| Frontend Vercel functions | `BACKEND_URL`, optional `WEBHOOK_ENDPOINT_PATH`     | Server-to-server webhook forwarding; proxy code has a fallback URL      |
| Backend Vercel project    | `FRONTEND_DNS`, optional other `FRONTEND_*` origins | PhonePe return URL and backend CORS allowlist                           |
| Backend Vercel project    | Firebase Admin, PhonePe, and admin-email variables  | Token verification, Firestore access, payment, and server authorization |

`VITE_*` values are compiled into the public browser bundle. Keep Firebase Admin credentials, PhonePe credentials, and webhook passwords in the backend's server environment. Keep the backend origin in the frontend's CSP `connect-src` list and the frontend origin in the backend CORS allowlist. For local development, use [`.env.example`](../.env.example) for frontend variable names and the backend repository's `.env.example` for server variables.

## Integration checks after changes

`bun run verify` exercises local unit and component tests; `bun run build` checks the production bundle. For a release that changes either side of the API boundary, also check a Vercel preview in a browser: public clinic status, valid and invalid dates, slot display, receipt lookup, admin sign-in and protected calls, and a PhonePe test payment through return and webhook handling. Check both Vercel projects' environment variables and deployment logs when a browser request fails.
