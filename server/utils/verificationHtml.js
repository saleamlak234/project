const verifyEmailTemplate = ({ fullName, url }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Request</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Saham Trading</h1>
        </div>
        <div class="content">
          <h2>Password Reset Request</h2>
          <p>Dear ${fullName},</p>
          <p>We received a request to reset your password. Click the button below to reset your password:</p>
          <a href="${url}" class="button">Reset Password</a>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Saham Trading. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = verifyEmailTemplate;