// Vercel serverless function to test webhook proxy functionality

export default async function handler(req, res) {
  try {
    // Test both GET and POST methods
    if (req.method === 'GET') {
      // Forward GET test to backend
      const backendUrl = 'https://debbarmaatanu-dev-dramlan-sentclini.vercel.app/payment/webhook-test';
      
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': req.headers['user-agent'] || 'webhook-test-proxy',
        },
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        const textResult = await response.text();
        return res.status(response.status).json({
          success: false,
          error: 'Backend returned non-JSON response',
          details: textResult
        });
      }
      
      return res.status(response.status).json({
        ...result,
        proxyInfo: {
          message: 'Request proxied through frontend',
          originalUrl: req.url,
          method: req.method,
          timestamp: new Date().toISOString(),
        }
      });
      
    } else if (req.method === 'POST') {
      // Forward POST test to backend
      const backendUrl = 'https://debbarmaatanu-dev-dramlan-sentclini.vercel.app/payment/webhook-test';
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': req.headers['user-agent'] || 'webhook-test-proxy',
        },
        body: JSON.stringify(req.body),
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        const textResult = await response.text();
        return res.status(response.status).json({
          success: false,
          error: 'Backend returned non-JSON response',
          details: textResult
        });
      }
      
      return res.status(response.status).json({
        ...result,
        proxyInfo: {
          message: 'POST request proxied through frontend',
          originalUrl: req.url,
          method: req.method,
          timestamp: new Date().toISOString(),
        }
      });
      
    } else {
      return res.status(405).json({ 
        success: false,
        error: 'Method not allowed',
        allowedMethods: ['GET', 'POST']
      });
    }
    
  } catch (error) {
    console.error('Webhook test proxy error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Webhook test proxy failed',
      details: error.message
    });
  }
}