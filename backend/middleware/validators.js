const crypto = require('crypto');

/**
 * Validate GitLab webhook signature
 * GitLab sends X-Gitlab-Token header with HMAC-SHA256 of the request body
 */
function validateGitlabSignature(body, secret, signature) {
  if (!secret || !signature) {
    return false;
  }

  // Calculate expected signature
  const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(bodyString)
    .digest('hex');

  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

module.exports = {
  validateGitlabSignature
};
