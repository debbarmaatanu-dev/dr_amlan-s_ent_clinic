// Vercel serverless function to proxy PhonePe webhooks to backend
// This allows using the approved domain for webhook URL

export default async function handler(req, res) {
  // Log all webhook attempts for debugging
  console.log('[WEBHOOK-PROXY] Webhook received');
  console.log('[WEBHOOK-PROXY] Method:', req.method);
  console.log('[WEBHOOK-PROXY] Headers:', JSON.stringify(req.headers));
  console.log('[WEBHOOK-PROXY] Body:', JSON.stringify(req.body));

  // Only allow POST requests from PhonePe
  if (req.method !== 'POST') {
    console.log('[WEBHOOK-PROXY] Rejecting non-POST request');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Forward the webhook to your backend
    const backendUrl = 'https://debbarmaatanu-dev-dramlan-sentclini.vercel.app/payment/webhook';
    console.log('[WEBHOOK-PROXY] Forwarding to backend:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || '',
        'User-Agent': req.headers['user-agent'] || '',
      },
      body: JSON.stringify(req.body),
    });

    let result;
    try {
      result = await response.json();
    } catch (jsonError) {
      // Handle non-JSON responses
      const textResult = await response.text();
      console.error('[WEBHOOK-PROXY] Backend returned non-JSON response:', textResult);
      return res.status(response.status).json({
        success: false,
        error: 'Backend returned invalid response format',
        details: textResult
      });
    }
    
    console.log('[WEBHOOK-PROXY] Backend response status:', response.status);
    console.log('[WEBHOOK-PROXY] Backend response:', JSON.stringify(result));
    
    // Return the same response PhonePe expects
    return res.status(response.status).json(result);
    
  } catch (error) {
    console.error('[WEBHOOK-PROXY] Webhook proxy error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Webhook proxy failed',
      details: error.message
    });
  }
}