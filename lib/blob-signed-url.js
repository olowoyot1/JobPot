const { issueSignedToken, presignUrl } = require('@vercel/blob');

// Generates a short-lived signed GET URL for a private blob.
// `pathname` must be the blob's pathname (as returned by put(), not a full URL).
async function getSignedViewUrl(pathname, validSeconds = 600) {
  if (!pathname) return null;
  try {
    const validUntil = Date.now() + validSeconds * 1000;
    const token = await issueSignedToken({
      pathname,
      operations: ['get'],
      validUntil,
    });
    const { presignedUrl } = await presignUrl(token, {
      operation: 'get',
      pathname,
      access: 'private',
      validUntil,
    });
    return presignedUrl;
  } catch {
    return null;
  }
}

module.exports = { getSignedViewUrl };
