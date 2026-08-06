/**
 * Production OAuth 2.0 Client Credentials Config (Google & GitHub)
 */
module.exports = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'mock-google-client-id.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock-google-client-secret',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || 'mock-github-client-id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'mock-github-client-secret',
    callbackUrl: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/auth/github/callback',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || 'apikey',
    pass: process.env.SMTP_PASS || '',
    fromEmail: process.env.SMTP_FROM || 'noreply@codesphere.dev',
  }
};
