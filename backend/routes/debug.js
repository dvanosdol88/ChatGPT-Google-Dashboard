import express from 'express';
const router = express.Router();

// Debug endpoint to check OAuth configuration
router.get('/oauth-status', (req, res) => {
  const hasClientId = !!process.env.GOOGLE_CLIENT_ID;
  const hasClientSecret = !!process.env.GOOGLE_CLIENT_SECRET;
  const hasRefreshToken = !!process.env.GOOGLE_REFRESH_TOKEN;
  const hasRedirectUri = !!process.env.GOOGLE_REDIRECT_URI;
  
  // Check token format (without revealing it)
  const tokenFormat = process.env.GOOGLE_REFRESH_TOKEN ? 
    process.env.GOOGLE_REFRESH_TOKEN.substring(0, 4) === '1//' ? 'valid' : 'invalid' 
    : 'missing';
  
  res.json({
    oauth_configured: hasClientId && hasClientSecret && hasRefreshToken,
    client_id_set: hasClientId,
    client_secret_set: hasClientSecret,
    refresh_token_set: hasRefreshToken,
    refresh_token_format: tokenFormat,
    redirect_uri_set: hasRedirectUri,
    token_length: process.env.GOOGLE_REFRESH_TOKEN ? process.env.GOOGLE_REFRESH_TOKEN.length : 0
  });
});

export default router;