# SAMACOOL Website Backend

This project contains a simple Node.js backend for handling service booking requests and sending email notifications.

## Backend setup

1. Copy `.env.example` to `.env` in the project root.
2. Fill the SMTP/email values:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password-or-app-password
EMAIL_FROM="SAMACOOL Service <your-email@example.com>"
BOOKING_TO_EMAIL=business-recipient@example.com
FRONTEND_ORIGIN=http://localhost:5500
PORT=3000
```

3. Install dependencies:

```bash
npm install
```

4. Start server:

```bash
npm start
```

5. Confirm it is running:

```bash
curl http://localhost:3000/api/health
```

## Frontend notes

The frontend now attempts EmailJS first and falls back to the backend endpoint at `/api/book-service` if EmailJS is unavailable or fails.

To test locally, serve the frontend with a local HTTP server:

```bash
npx http-server . -p 5500
```

Then open `http://localhost:5500` and submit the form.
