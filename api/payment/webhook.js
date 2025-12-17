// Vercel serverless function to proxy PhonePe webhooks to backend
// This allows using the approved domain for webhook URL

export default async function handler(req, res) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Minimal logging for production
  if (!isProduction) {
    console.log('=== WEBHOOK PROXY CALLED ===');
    console.log('[WEBHOOK-PROXY] Timestamp:', new Date().toISOString());
    console.log('[WEBHOOK-PROXY] Method:', req.method);
    console.log('[WEBHOOK-PROXY] URL:', req.url);
    console.log('[WEBHOOK-PROXY] Body:', JSON.stringify(req.body, null, 2));
    console.log('=== END WEBHOOK PROXY LOG ===');
  }

  // Allow GET for health checks
  if (req.method === 'GET') {
    return res.status(200).json({ 
      success: true, 
      message: 'Webhook proxy is reachable via GET',
      timestamp: new Date().toISOString()
    });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', method: req.method });
  }

  try {
    // Forward the webhook to your backend using environment variable
    const backendBaseUrl = process.env.BACKEND_URL || 'https://debbarmaatanu-dev-dramlan-sentclini.vercel.app';
    const webhookPath = process.env.WEBHOOK_ENDPOINT_PATH || '/payment/webhook';
    const backendUrl = new URL(webhookPath, backendBaseUrl).href;
    
    // Only log in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('[WEBHOOK-PROXY] Forwarding to backend:', backendUrl);
    }
    
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
      if (!isProduction) {
        console.error('[WEBHOOK-PROXY] Backend returned non-JSON response:', textResult);
      }
      return res.status(response.status).json({
        success: false,
        error: 'Backend returned invalid response format'
      });
    }
    
    if (!isProduction) {
      console.log('[WEBHOOK-PROXY] Backend response status:', response.status);
      console.log('[WEBHOOK-PROXY] Backend response:', JSON.stringify(result));
    }
    
    // Return the same response PhonePe expects
    return res.status(response.status).json(result);
    
  } catch (error) {
    console.error('[WEBHOOK-PROXY] Webhook proxy error:', error.message);
    return res.status(500).json({ 
      success: false, 
      error: 'Webhook proxy failed'
    });
  }
}