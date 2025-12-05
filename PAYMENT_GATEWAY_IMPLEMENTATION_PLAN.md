# Razorpay Payment Gateway Implementation Plan

## Project Overview
**Clinic:** Dr. (Major) Amlan's ENT Clinic  
**Payment Gateway:** Razorpay Payment Gateway  
**Consultation Fee:** ₹400 (Fixed)  
**Architecture:** React Frontend + Express Backend (Render.com) + Firebase Firestore  

## ✅ Current Status
**Phase 1: Backend Implementation - COMPLETED**
- Razorpay SDK installed
- Payment services created
- Booking services created
- API routes implemented
- Security measures in place  

---

## Requirements

### Functional Requirements

#### 1. Payment Flow
- User fills appointment booking form (date, name, gender, age, phone)
- User clicks "Book & Pay ₹400" button
- Frontend sends booking data to Express backend
- Backend validates data and creates Razorpay payment order
- Backend returns order details to frontend
- Frontend opens Razorpay checkout modal
- User completes payment in modal
- Razorpay returns payment details to frontend
- Frontend sends payment details to backend for verification
- Backend verifies payment signature
- Backend creates Firestore booking document (using Admin SDK)
- Frontend shows success/failure message

#### 2. Security Requirements ✅ IMPLEMENTED
- ✅ All payment API calls go through Express backend
- ✅ Razorpay keys stored in backend environment variables
- ✅ Payment amount (₹400) validated on backend (prevent manipulation)
- ✅ Payment signature verified on backend using HMAC SHA256
- ✅ Rate limiting on payment endpoints (existing middleware)
- ✅ CORS protection (only allow frontend domain)
- ✅ Helmet security headers
- ✅ Request payload size limits

#### 3. Data Requirements ✅ IMPLEMENTED
- ✅ Store booking data in Firestore only after successful payment
- ✅ Store payment transaction ID (paymentId, orderId) with booking
- ✅ Store payment status ('paid')
- ✅ Maintain pending_bookings collection for incomplete payments
- ✅ Use Firestore transactions to prevent race conditions

#### 4. User Experience Requirements
- Clear payment status indicators (loading, success, failure)
- Error messages for payment failures
- Automatic refund initiation if booking fails after payment
- SMS/Email confirmation after successful booking
- Display booking details (slot number, date, time) after payment

#### 5. Business Requirements
- Fixed consultation fee: ₹400
- Online slots: 10 per day
- Payment required before booking confirmation
- No booking without payment
- Refund policy for failed bookings

---

## Technical Architecture

### Current Setup
```
Frontend (React + Vite)
  ├── Hosted: Cloudflare Pages
  ├── Firebase Client SDK
  └── Direct Firestore writes (current - will be removed)

Backend (Express.js)
  ├── Hosted: Render.com
  ├── Firebase Admin SDK
  ├── Security: CORS, Rate Limiting, Helmet
  └── Environment Variables (secure)

Database (Firebase Firestore)
  ├── Collection: appointment_bookings
  ├── Collection: pending_bookings (new)
  └── Spark Plan (Free tier)
```

### New Architecture (With Razorpay) ✅ IMPLEMENTED
```
Frontend (React)
    ↓
    | 1. User submits booking form
    ↓
Express Backend (Render.com) ✅
    ↓
    | 2. Validate booking data ✅
    | 3. Create Razorpay payment order ✅
    | 4. Store pending booking ✅
    | 5. Return order details to frontend ✅
    ↓
Frontend
    ↓
    | 6. Open Razorpay checkout modal
    | 7. User completes payment
    | 8. Get payment response
    ↓
Express Backend ✅
    ↓
    | 9. Verify payment signature ✅
    | 10. Create Firestore booking (Admin SDK) ✅
    | 11. Return booking confirmation ✅
    ↓
Frontend
    ↓
    | 12. Display success message
```


---

## Razorpay Integration Details ✅ IMPLEMENTED

### Razorpay Payment Gateway Overview
- **Provider:** Razorpay (Indian payment gateway)
- **Supported Methods:** UPI, Cards, Net Banking, Wallets
- **Transaction Fee:** ~2% (varies by payment method)
- **Settlement:** T+2 days
- **Documentation:** https://razorpay.com/docs/

### Razorpay API (Backend Only)
- **Create Order:** Razorpay SDK `razorpay.orders.create()`
- **Verify Signature:** HMAC SHA256 verification
- **Keys:** Test keys configured (rzp_test_*)

### Razorpay Payment Flow ✅ IMPLEMENTED
```
1. Backend creates Razorpay order ✅
   - amount: 40000 (₹400 in paise)
   - currency: INR
   - receipt: booking_timestamp
   - notes: {date, name, gender, age, phone}

2. Backend stores pending booking ✅
   - Collection: pending_bookings
   - Document ID: order_id
   - Status: 'pending'

3. Backend returns order details ✅
   - orderId
   - amount
   - currency
   - razorpayKeyId (public key)

4. Frontend opens Razorpay checkout
   - Razorpay.js library
   - Modal with payment options
   - User completes payment

5. Frontend receives payment response
   - razorpay_order_id
   - razorpay_payment_id
   - razorpay_signature

6. Frontend sends to backend for verification

7. Backend verifies signature ✅
   - HMAC SHA256(order_id|payment_id, secret_key)
   - Compare with received signature

8. Backend creates booking if valid ✅
   - Firestore transaction
   - Update pending booking
   - Create appointment booking
```


---

## Action Plan

### Phase 1: Backend Setup (Express on Render.com) ✅ COMPLETED

#### Step 1.1: Install Dependencies ✅
```bash
cd dr_amlan-s_ent_clinic_backend
npm install razorpay
```

#### Step 1.2: Environment Variables ✅
Already configured in `.env`:
```env
# Razorpay Configuration ✅
RAZORPAY_KEY_ID=rzp_test_Rnbaur9cW1kSf9
RAZORPAY_KEY_SECRET=XN7qYTZmuqaDPKJGSjFU17BM

# Frontend URLs (for CORS) ✅
FRONTEND_LOCAL=http://localhost:5173
FRONTEND_VERCEL=https://dr-amlan-s-ent-clinic.pages.dev/
FRONTEND_DNS=https://www.btcstagartala.org
FRONTEND_ROOT=https://btcstagartala.org

# Firebase Admin SDK ✅
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

#### Step 1.3: Create Razorpay Service ✅
File: `backend/src/services/razorpayService.ts`
- ✅ Function: `createPaymentOrder()` - Creates Razorpay order
- ✅ Function: `verifyPaymentSignature()` - Verifies HMAC SHA256 signature

#### Step 1.4: Create Payment Routes ✅
File: `backend/src/routes/paymentRoutes.ts`
- ✅ POST `/api/payment/create-order` - Create Razorpay order
- ✅ POST `/api/payment/verify` - Verify payment and confirm booking

#### Step 1.5: Create Booking Service ✅
File: `backend/src/services/bookingService.ts`
- ✅ Function: `createPendingBooking()` - Store temporary booking
- ✅ Function: `confirmBooking()` - Create actual booking after payment (with transaction)
- ✅ Function: `cancelBooking()` - Handle failed payments

#### Step 1.6: Rate Limiting ✅
Already configured via existing middleware:
```javascript
// Applied to all /api/payment/* routes
app.use('/api/payment', rateLimiter, paymentRoutes);
```


### Phase 2: Frontend Updates (React) 🔄 IN PROGRESS

#### Step 2.1: Update Appointment Service
File: `frontend/src/services/appointmentService.ts`
- [ ] Remove direct Firestore writes (currently using client SDK)
- [ ] Add function: `initiatePayment()` - Call backend `/api/payment/create-order`
- [ ] Add function: `verifyPayment()` - Call backend `/api/payment/verify`

#### Step 2.2: Add Razorpay Script
File: `frontend/index.html`
- [ ] Add Razorpay checkout script: `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>`

#### Step 2.3: Update Appointment Page
File: `frontend/src/pages/Appointment.tsx`
- [ ] Change button text: "Book Appointment" → "Book & Pay ₹400"
- [ ] Add payment loading state
- [ ] Open Razorpay checkout modal
- [ ] Handle payment success/failure
- [ ] Call backend to verify payment

#### Step 2.4: Add Environment Variable
File: `frontend/.env.local`
- [ ] Add: `VITE_BACKEND_URL=https://your-backend.onrender.com`

#### Step 2.5: Optional: Payment Status Component
File: `frontend/src/components/PaymentStatus.tsx`
- [ ] Loading state during payment
- [ ] Success state with booking details
- [ ] Failure state with retry option

### Phase 3: Firestore Structure Updates

#### Step 3.1: Create Pending Bookings Collection
```
Collection: pending_bookings
Document ID: {merchantTransactionId}
Fields:
  - transactionId: string
  - date: string
  - name: string
  - gender: string
  - age: number
  - phone: string
  - email?: string
  - amount: number
  - status: 'pending' | 'completed' | 'failed'
  - createdAt: timestamp
  - expiresAt: timestamp (30 minutes)
```

#### Step 3.2: Update Appointment Bookings Collection ✅ IMPLEMENTED
```
Collection: appointment_bookings
Document ID: {dd-mm-yyyy}
Fields:
  - bookings: array
    - slotNumber: number
    - name: string
    - gender: string
    - age: number
    - phone: string
    - paymentId: string ✅ (razorpay_payment_id)
    - orderId: string ✅ (razorpay_order_id)
    - amount: number ✅ (400)
    - paymentStatus: 'paid' ✅
    - timestamp: serverTimestamp ✅
```


### Phase 4: Testing

#### Step 4.1: UAT Testing (PhonePe Sandbox)
- Test successful payment flow
- Test failed payment flow
- Test payment timeout
- Test webhook delivery
- Test signature verification
- Test concurrent bookings with payment

#### Step 4.2: Edge Cases Testing
- User closes payment page
- User goes back during payment
- Payment succeeds but webhook fails
- Payment succeeds but booking fails (no slots)
- Duplicate payment attempts
- Invalid signature in webhook

#### Step 4.3: Security Testing
- Test rate limiting
- Test CORS protection
- Test amount manipulation attempts
- Test signature tampering
- Test replay attacks

#### Step 4.4: Performance Testing
- Test with multiple concurrent payments
- Test webhook response time
- Test Firestore transaction performance

### Phase 5: Deployment

#### Step 5.1: Backend Deployment
1. Push code to GitHub
2. Render.com auto-deploys
3. Verify environment variables
4. Test API endpoints
5. Configure PhonePe webhook URL in dashboard

#### Step 5.2: Frontend Deployment
1. Update API endpoint URLs
2. Build production bundle: `npm run build`
3. Deploy to Cloudflare Pages
4. Verify CORS configuration
5. Test payment flow end-to-end

#### Step 5.3: PhonePe Production Setup
1. Complete KYC verification
2. Get production credentials
3. Update environment variables
4. Configure webhook URL
5. Test with small amount

#### Step 5.4: Monitoring Setup
1. Setup error logging (Sentry/LogRocket)
2. Setup payment monitoring dashboard
3. Setup webhook failure alerts
4. Setup daily reconciliation reports


---

## Implementation Checklist

### Backend (Express on Render.com) ✅ COMPLETED
- [x] Install Razorpay package
- [x] Add Razorpay environment variables
- [x] Create Razorpay service (payment order, signature verification)
- [x] Create payment routes (create order, verify payment)
- [x] Rate limiting middleware (already exists)
- [x] Create booking service (pending bookings, confirm booking, cancel)
- [x] Add payment signature verification (HMAC SHA256)
- [x] TypeScript compilation successful
- [ ] Test with Razorpay test keys
- [ ] Deploy to Render.com

### Frontend (React on Cloudflare Pages) 🔄 PENDING
- [ ] Add Razorpay checkout script to index.html
- [ ] Add VITE_BACKEND_URL environment variable
- [ ] Remove direct Firestore writes from appointment service
- [ ] Add initiatePayment() function (call backend, open Razorpay modal)
- [ ] Update Appointment page UI (button text, loading states)
- [ ] Handle Razorpay payment success/failure
- [ ] Display booking confirmation
- [ ] Test payment flow with test keys
- [ ] Deploy to Cloudflare Pages

### Firestore
- [ ] Create pending_bookings collection
- [ ] Update appointment_bookings structure
- [ ] Add Firestore security rules for pending bookings
- [ ] Setup automatic cleanup for expired pending bookings

### Razorpay Setup
- [x] Register merchant account
- [x] Get test credentials (rzp_test_*)
- [ ] Test in test environment
- [ ] Complete KYC verification
- [ ] Get production credentials (rzp_live_*)
- [ ] Switch to production keys
- [ ] Test in production

### Testing
- [ ] Test successful payment flow
- [ ] Test failed payment flow
- [ ] Test payment timeout
- [ ] Test webhook delivery
- [ ] Test signature verification
- [ ] Test concurrent bookings
- [ ] Test rate limiting
- [ ] Test CORS protection
- [ ] Test amount validation
- [ ] Test edge cases

### Documentation
- [ ] API documentation for payment endpoints
- [ ] Payment flow diagram
- [ ] Error handling guide
- [ ] Refund process documentation
- [ ] Troubleshooting guide


---

## Code Examples ✅ IMPLEMENTED

### Backend: Create Payment Order ✅
```typescript
// backend/src/services/razorpayService.ts
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createPaymentOrder = async (amount: number, bookingData) => {
  const options = {
    amount: amount * 100, // Convert to paise (₹400 = 40000 paise)
    currency: 'INR',
    receipt: `booking_${Date.now()}`,
    notes: {
      date: bookingData.date,
      name: bookingData.name,
      gender: bookingData.gender,
      age: bookingData.age.toString(),
      phone: bookingData.phone,
    },
  };

  const order = await razorpay.orders.create(options);
  return {success: true, order};
};
```

### Backend: Verify Payment Signature ✅
```typescript
// backend/src/services/razorpayService.ts
import crypto from 'crypto';

export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string,
): boolean => {
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === signature;
};
```

### Backend: Payment Routes ✅
```typescript
// backend/src/routes/paymentRoutes.ts
router.post('/create-order', async (req, res) => {
  const {date, name, gender, age, phone, amount} = req.body;
  
  // Validate amount
  if (amount !== 400) {
    return res.status(400).json({error: 'Invalid amount'});
  }
  
  // Create Razorpay order
  const orderResult = await createPaymentOrder(amount, {date, name, gender, age, phone});
  
  // Create pending booking
  await createPendingBooking(orderResult.order.id, {date, name, gender, age, phone, amount});
  
  return res.json({
    success: true,
    orderId: orderResult.order.id,
    amount: orderResult.order.amount,
    currency: orderResult.order.currency,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  });
});

router.post('/verify', async (req, res) => {
  const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
  
  // Verify signature
  const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  
  if (!isValid) {
    await cancelBooking(razorpay_order_id);
    return res.status(400).json({error: 'Invalid payment signature'});
  }
  
  // Confirm booking
  const bookingResult = await confirmBooking(razorpay_order_id, razorpay_payment_id);
  
  return res.json({
    success: true,
    slotNumber: bookingResult.slotNumber,
    date: bookingResult.date,
    name: bookingResult.name,
  });
});
```


### Frontend: Initiate Payment (TO BE IMPLEMENTED)
```typescript
// frontend/src/services/appointmentService.ts
export const initiatePayment = async (
  date: string,
  name: string,
  gender: string,
  age: number,
  phone: string,
) => {
  try {
    // Step 1: Create order on backend
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-order`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({date, name, gender, age, phone, amount: 400}),
      }
    );
    
    const data = await response.json();
    
    if (!data.success) {
      return {success: false, error: data.error};
    }
    
    // Step 2: Open Razorpay checkout
    const options = {
      key: data.razorpayKeyId,
      amount: data.amount,
      currency: data.currency,
      order_id: data.orderId,
      name: "Dr. (Major) Amlan's ENT Clinic",
      description: 'Appointment Booking Fee',
      prefill: {name, contact: phone},
      theme: {color: '#3B82F6'},
      handler: async function (response: any) {
        // Step 3: Verify payment on backend
        const verifyResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify`,
          {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          }
        );
        
        const verifyData = await verifyResponse.json();
        
        if (verifyData.success) {
          // Show success message
          return {success: true, booking: verifyData};
        } else {
          return {success: false, error: verifyData.error};
        }
      },
    };
    
    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
    
  } catch (error) {
    return {success: false, error: 'Failed to initiate payment'};
  }
};
```

### Frontend: Add Razorpay Script (TO BE IMPLEMENTED)
```html
<!-- frontend/index.html -->
<head>
  <!-- Add before closing </head> tag -->
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
</head>
```


---

## Security Measures

### 1. Amount Validation
```javascript
// Backend validates amount - frontend cannot manipulate
if (req.body.amount !== 400) {
  return res.status(400).json({ error: 'Invalid amount' });
}
```

### 2. Signature Verification
```javascript
// Verify PhonePe webhook signature
const expectedSignature = crypto
  .createHash('sha256')
  .update(response + SALT_KEY)
  .digest('hex') + '###' + SALT_INDEX;

if (xVerify !== expectedSignature) {
  throw new Error('Invalid signature');
}
```

### 3. Rate Limiting
```javascript
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many payment attempts'
});
```

### 4. CORS Protection
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### 5. Environment Variables
```
Never commit:
- PHONEPE_MERCHANT_ID
- PHONEPE_SALT_KEY
- PHONEPE_SALT_INDEX
```

---

## Error Handling

### Payment Errors
1. **Payment Declined** - Show retry option
2. **Payment Timeout** - Show retry option
3. **Network Error** - Show retry option
4. **Insufficient Funds** - Show error message
5. **Invalid Card** - Show error message

### Booking Errors
1. **No Slots Available** - Initiate refund, show error
2. **Invalid Date** - Show error, don't create payment
3. **Duplicate Booking** - Check before payment
4. **Firestore Error** - Initiate refund, log error

### Webhook Errors
1. **Invalid Signature** - Reject webhook, log error
2. **Duplicate Webhook** - Idempotency check
3. **Webhook Timeout** - Retry mechanism
4. **Processing Error** - Log and alert admin

---

## Cost Analysis

### Razorpay Transaction Fees
- UPI: 0% (free for first ₹50,000, then 2%)
- Debit Card: ~1%
- Credit Card: ~2%
- Net Banking: ~1.5%
- Wallets: ~2%

### Estimated Monthly Costs (1000 bookings)
- Bookings: 1000 × ₹400 = ₹4,00,000
- Razorpay fees (avg 2%): ₹8,000
- SMS notifications (optional): ₹150
- Render.com hosting: Free (Starter plan)
- Firebase Firestore: Free (Spark plan)
- **Total Cost: ~₹8,150/month**

### Revenue
- Gross: ₹4,00,000
- Net (after fees): ₹3,91,850
- Profit margin: 98%

---

## Timeline

### Week 1: Backend Development
- Day 1-2: Setup PhonePe service
- Day 3-4: Create payment routes
- Day 5: Testing and debugging

### Week 2: Frontend Development
- Day 1-2: Update appointment service
- Day 3-4: Create payment callback page
- Day 5: Testing and debugging

### Week 3: Integration & Testing
- Day 1-2: End-to-end testing
- Day 3-4: Security testing
- Day 5: UAT with PhonePe sandbox

### Week 4: Deployment
- Day 1-2: Production deployment
- Day 3-4: Monitoring and bug fixes
- Day 5: Go live

---

## Support & Maintenance

### Daily Tasks
- Monitor payment success rate
- Check webhook delivery
- Review error logs
- Reconcile payments with bookings

### Weekly Tasks
- Generate payment reports
- Check refund requests
- Update documentation
- Security audit

### Monthly Tasks
- Analyze payment trends
- Optimize conversion rate
- Review PhonePe fees
- Update dependencies

---

## Rollback Plan

### If Payment Gateway Fails
1. Disable payment button
2. Show "Booking temporarily unavailable" message
3. Collect bookings via phone/WhatsApp
4. Fix issue and redeploy
5. Enable payment button

### If Webhook Fails
1. Implement manual payment verification
2. Check payment status via PhonePe API
3. Manually create bookings
4. Fix webhook and redeploy

### If Firestore Fails
1. Store bookings in backend database (temporary)
2. Sync to Firestore when available
3. Notify users of delay

---

## Success Metrics

### Key Performance Indicators (KPIs)
- Payment success rate: >95%
- Webhook delivery rate: >99%
- Average payment time: <2 minutes
- Booking confirmation time: <30 seconds
- Refund processing time: <24 hours

### Monitoring
- Real-time payment dashboard
- Error rate alerts
- Webhook failure alerts
- Daily reconciliation reports

---

## Conclusion

This implementation plan provides a secure, scalable, and cost-effective payment gateway integration using Razorpay. The architecture leverages the existing Express backend for security and Firebase Firestore for data storage, ensuring a smooth payment experience for patients booking appointments at Dr. Amlan's ENT Clinic.

**Current Status:**
- ✅ Phase 1: Backend Implementation - COMPLETED
- 🔄 Phase 2: Frontend Integration - PENDING
- ⏳ Phase 3: Testing - PENDING
- ⏳ Phase 4: Deployment - PENDING

**Next Steps:**
1. ✅ Backend implementation (DONE)
2. 🔄 Frontend integration (IN PROGRESS)
   - Add Razorpay script
   - Update appointment service
   - Integrate Razorpay checkout
3. Test with Razorpay test keys
4. Deploy to production
5. Switch to production keys

**Estimated Time to Completion:** 1-2 weeks (backend done)  
**Estimated Cost:** ₹8,150/month (for 1000 bookings)  
**Backend API:** Ready for frontend integration
