# PhonePe Payment Gateway Implementation Plan

## Project Overview
**Clinic:** Dr. (Major) Amlan's ENT Clinic  
**Payment Gateway:** PhonePe Payment Gateway  
**Consultation Fee:** ₹400 (Fixed)  
**Architecture:** React Frontend + Express Backend (Render.com) + Firebase Firestore  

---

## Requirements

### Functional Requirements

#### 1. Payment Flow
- User fills appointment booking form (date, name, gender, age, phone, email)
- User clicks "Book & Pay ₹400" button
- Frontend sends booking data to Express backend
- Backend validates data and creates PhonePe payment order
- Backend returns payment URL/details to frontend
- Frontend redirects user to PhonePe payment page
- User completes payment on PhonePe
- PhonePe redirects back to frontend with payment status
- Backend receives webhook from PhonePe for payment confirmation
- Backend verifies payment signature
- Backend creates Firestore booking document (using Admin SDK)
- Frontend shows success/failure message

#### 2. Security Requirements
- All payment API calls must go through Express backend
- PhonePe merchant keys must be stored in backend environment variables
- Payment amount (₹400) must be validated on backend (prevent manipulation)
- Payment signature must be verified on backend
- Rate limiting on payment endpoints (max 5 attempts/hour/IP)
- CORS protection (only allow frontend domain)
- Helmet security headers
- Request payload size limits

#### 3. Data Requirements
- Store booking data in Firestore only after successful payment
- Store payment transaction ID with booking
- Store payment status (pending/success/failed)
- Maintain pending bookings collection for incomplete payments

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

### New Architecture (With PhonePe)
```
Frontend (React)
    ↓
    | 1. User submits booking form
    ↓
Express Backend (Render.com)
    ↓
    | 2. Validate booking data
    | 3. Check slot availability
    | 4. Create PhonePe payment order
    | 5. Store pending booking
    ↓
PhonePe Payment Gateway
    ↓
    | 6. User completes payment
    | 7. PhonePe sends webhook
    ↓
Express Backend
    ↓
    | 8. Verify payment signature
    | 9. Create Firestore booking (Admin SDK)
    | 10. Send confirmation SMS/Email
    ↓
Frontend
    ↓
    | 11. Display success message
```


---

## PhonePe Integration Details

### PhonePe Payment Gateway Overview
- **Provider:** PhonePe (Indian payment gateway)
- **Supported Methods:** UPI, Cards, Net Banking, Wallets
- **Transaction Fee:** ~2% (varies by payment method)
- **Settlement:** T+1 days
- **Documentation:** https://developer.phonepe.com/

### PhonePe API Endpoints
1. **Payment Initiation:** `/pg/v1/pay`
2. **Payment Status Check:** `/pg/v1/status/{merchantId}/{transactionId}`
3. **Webhook:** Configured in PhonePe dashboard

### PhonePe Authentication
- **Merchant ID:** Provided by PhonePe
- **Salt Key:** Secret key for signature generation
- **Salt Index:** Version of salt key
- **API Endpoint:** Production/UAT based on environment

### PhonePe Payment Flow
```
1. Backend creates payment request
   - merchantTransactionId (unique)
   - amount (in paise: 40000 for ₹400)
   - merchantUserId (phone number)
   - redirectUrl (frontend callback URL)
   - callbackUrl (backend webhook URL)

2. Generate X-VERIFY header
   - Base64(payload) + "/pg/v1/pay" + saltKey
   - SHA256 hash + "###" + saltIndex

3. POST to PhonePe API
   - Returns payment URL

4. Redirect user to payment URL

5. User completes payment

6. PhonePe sends webhook to backend
   - Contains payment status
   - Contains signature for verification

7. Backend verifies signature
   - Decode response
   - Generate expected signature
   - Compare signatures

8. Create booking if payment successful
```


---

## Action Plan

### Phase 1: Backend Setup (Express on Render.com)

#### Step 1.1: Install Dependencies
```bash
cd dr_amlan-s_ent_clinic_backend
npm install axios crypto
```

#### Step 1.2: Environment Variables
Add to Render.com environment variables:
```env
# PhonePe Configuration
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_API_ENDPOINT=https://api.phonepe.com/apis/hermes
PHONEPE_REDIRECT_URL=https://your-clinic.pages.dev/payment-callback
PHONEPE_CALLBACK_URL=https://your-backend.onrender.com/api/phonepe-webhook

# Frontend URL (for CORS)
FRONTEND_URL=https://your-clinic.pages.dev

# Firebase Admin SDK (already configured)
FIREBASE_SERVICE_ACCOUNT_KEY=...
```

#### Step 1.3: Create PhonePe Service
File: `backend/src/services/phonepeService.ts`
- Function: `createPaymentOrder()`
- Function: `verifyPaymentSignature()`
- Function: `checkPaymentStatus()`

#### Step 1.4: Create Payment Routes
File: `backend/src/routes/paymentRoutes.ts`
- POST `/api/create-payment-order` - Create PhonePe payment
- POST `/api/phonepe-webhook` - Receive payment status
- GET `/api/payment-status/:transactionId` - Check payment status

#### Step 1.5: Update Booking Service
File: `backend/src/services/bookingService.ts`
- Function: `createPendingBooking()` - Store temporary booking
- Function: `confirmBooking()` - Create actual booking after payment
- Function: `cancelBooking()` - Handle failed payments

#### Step 1.6: Add Rate Limiting
```javascript
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 payment attempts per hour
  message: 'Too many payment attempts'
});
```


### Phase 2: Frontend Updates (React)

#### Step 2.1: Update Appointment Service
File: `frontend/src/services/appointmentService.ts`
- Remove direct Firestore writes
- Add function: `initiatePayment()` - Call backend to create payment
- Add function: `verifyPayment()` - Verify payment status

#### Step 2.2: Update Appointment Page
File: `frontend/src/pages/Appointment.tsx`
- Change button text: "Book Appointment" → "Book & Pay ₹400"
- Add payment loading state
- Handle payment redirect
- Handle payment callback

#### Step 2.3: Create Payment Callback Page
File: `frontend/src/pages/PaymentCallback.tsx`
- Parse URL parameters (transactionId, status)
- Call backend to verify payment
- Show success/failure message
- Redirect to home after 5 seconds

#### Step 2.4: Update Routing
File: `frontend/src/Routing.tsx`
- Add route: `/payment-callback`

#### Step 2.5: Add Payment Status Component
File: `frontend/src/components/PaymentStatus.tsx`
- Loading state during payment
- Success state with booking details
- Failure state with retry option

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

#### Step 3.2: Update Appointment Bookings Collection
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
    - email?: string
    - paymentId: string (NEW)
    - transactionId: string (NEW)
    - amount: number (NEW)
    - paymentStatus: 'paid' (NEW)
    - timestamp: string
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

### Backend (Express on Render.com)
- [ ] Install axios and crypto packages
- [ ] Add PhonePe environment variables
- [ ] Create PhonePe service (payment order, signature verification)
- [ ] Create payment routes (create order, webhook, status check)
- [ ] Add rate limiting middleware
- [ ] Update booking service (pending bookings, confirm booking)
- [ ] Add webhook signature verification
- [ ] Add payment status check endpoint
- [ ] Test with PhonePe sandbox
- [ ] Deploy to Render.com

### Frontend (React on Cloudflare Pages)
- [ ] Remove direct Firestore writes from appointment service
- [ ] Add initiatePayment() function
- [ ] Update Appointment page UI (button text, loading states)
- [ ] Create PaymentCallback page
- [ ] Add payment status component
- [ ] Update routing for payment callback
- [ ] Handle payment redirect
- [ ] Handle payment success/failure
- [ ] Test payment flow
- [ ] Deploy to Cloudflare Pages

### Firestore
- [ ] Create pending_bookings collection
- [ ] Update appointment_bookings structure
- [ ] Add Firestore security rules for pending bookings
- [ ] Setup automatic cleanup for expired pending bookings

### PhonePe Setup
- [ ] Register merchant account
- [ ] Complete KYC verification
- [ ] Get sandbox credentials
- [ ] Test in sandbox environment
- [ ] Get production credentials
- [ ] Configure webhook URL
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

## Code Examples

### Backend: Create Payment Order
```javascript
// backend/src/services/phonepeService.ts
import axios from 'axios';
import crypto from 'crypto';

export const createPaymentOrder = async (bookingData) => {
  const merchantTransactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const payload = {
    merchantId: process.env.PHONEPE_MERCHANT_ID,
    merchantTransactionId: merchantTransactionId,
    merchantUserId: bookingData.phone,
    amount: 40000, // ₹400 in paise
    redirectUrl: `${process.env.PHONEPE_REDIRECT_URL}?transactionId=${merchantTransactionId}`,
    redirectMode: 'REDIRECT',
    callbackUrl: process.env.PHONEPE_CALLBACK_URL,
    mobileNumber: bookingData.phone,
    paymentInstrument: {
      type: 'PAY_PAGE'
    }
  };
  
  // Generate signature
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
  const string = base64Payload + '/pg/v1/pay' + process.env.PHONEPE_SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const xVerify = sha256 + '###' + process.env.PHONEPE_SALT_INDEX;
  
  // Call PhonePe API
  const response = await axios.post(
    `${process.env.PHONEPE_API_ENDPOINT}/pg/v1/pay`,
    { request: base64Payload },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify
      }
    }
  );
  
  return {
    transactionId: merchantTransactionId,
    paymentUrl: response.data.data.instrumentResponse.redirectInfo.url
  };
};
```

### Backend: Verify Payment Webhook
```javascript
// backend/src/routes/paymentRoutes.ts
app.post('/api/phonepe-webhook', async (req, res) => {
  try {
    const { response } = req.body;
    const xVerify = req.headers['x-verify'];
    
    // Verify signature
    const decodedResponse = Buffer.from(response, 'base64').toString('utf-8');
    const expectedSignature = crypto
      .createHash('sha256')
      .update(response + process.env.PHONEPE_SALT_KEY)
      .digest('hex') + '###' + process.env.PHONEPE_SALT_INDEX;
    
    if (xVerify !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    const paymentData = JSON.parse(decodedResponse);
    
    if (paymentData.code === 'PAYMENT_SUCCESS') {
      // Create booking in Firestore
      await confirmBooking(paymentData.data.merchantTransactionId);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});
```


### Frontend: Initiate Payment
```typescript
// frontend/src/services/appointmentService.ts
export const initiatePayment = async (
  date: string,
  name: string,
  gender: string,
  age: number,
  phone: string,
  email?: string
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/create-payment-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          name,
          gender,
          age,
          phone,
          email,
          amount: 400,
        }),
      }
    );
    
    const data = await response.json();
    
    if (data.success) {
      // Redirect to PhonePe payment page
      window.location.href = data.paymentUrl;
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    return { success: false, error: 'Failed to initiate payment' };
  }
};
```

### Frontend: Payment Callback Page
```typescript
// frontend/src/pages/PaymentCallback.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  
  useEffect(() => {
    const transactionId = searchParams.get('transactionId');
    
    if (transactionId) {
      verifyPayment(transactionId);
    }
  }, [searchParams]);
  
  const verifyPayment = async (transactionId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment-status/${transactionId}`
      );
      
      const data = await response.json();
      
      if (data.success && data.paymentStatus === 'SUCCESS') {
        setStatus('success');
        setBookingDetails(data.booking);
        
        // Redirect to home after 5 seconds
        setTimeout(() => navigate('/'), 5000);
      } else {
        setStatus('failed');
      }
    } catch (error) {
      setStatus('failed');
    }
  };
  
  if (status === 'loading') {
    return <div>Verifying payment...</div>;
  }
  
  if (status === 'success') {
    return (
      <div>
        <h1>Payment Successful!</h1>
        <p>Slot Number: {bookingDetails.slotNumber}</p>
        <p>Date: {bookingDetails.date}</p>
      </div>
    );
  }
  
  return <div>Payment Failed. Please try again.</div>;
};
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

### PhonePe Transaction Fees
- UPI: ~0% (free for customers, merchant pays)
- Debit Card: ~1%
- Credit Card: ~2%
- Net Banking: ~1.5%

### Estimated Monthly Costs (1000 bookings)
- Bookings: 1000 × ₹400 = ₹4,00,000
- PhonePe fees (avg 1.5%): ₹6,000
- SMS notifications: ₹150
- Render.com hosting: Free (Starter plan)
- Firebase Firestore: Free (Spark plan)
- **Total Cost: ~₹6,150/month**

### Revenue
- Gross: ₹4,00,000
- Net (after fees): ₹3,93,850
- Profit margin: 98.5%

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

This implementation plan provides a secure, scalable, and cost-effective payment gateway integration using PhonePe. The architecture leverages the existing Express backend for security and Firebase Firestore for data storage, ensuring a smooth payment experience for patients booking appointments at Dr. Amlan's ENT Clinic.

**Next Steps:**
1. Review and approve this plan
2. Setup PhonePe merchant account
3. Begin backend development
4. Test in sandbox environment
5. Deploy to production

**Estimated Time to Completion:** 4 weeks  
**Estimated Cost:** ₹6,150/month (for 1000 bookings)  
**Expected Go-Live Date:** [To be determined]
