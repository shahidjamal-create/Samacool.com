require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE,
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_FROM,
    BOOKING_TO_EMAIL,
    FRONTEND_ORIGIN,
    PORT
} = process.env;

function requireEnv(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

function validateBookingPayload(payload) {
    const errors = [];

    if (!payload.customer_name || !payload.customer_name.trim()) {
        errors.push('Customer name is required.');
    }

    if (!payload.phone_number || !/^([6-9]\d{9})$/.test(payload.phone_number)) {
        errors.push('A valid 10-digit Indian mobile number is required.');
    }

    if (!payload.email_address || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email_address)) {
        errors.push('A valid email address is required.');
    }

    if (!payload.service_type || !payload.service_type.trim()) {
        errors.push('Service type is required.');
    }

    return errors;
}

function createTransporter() {
    return nodemailer.createTransport({
        host: requireEnv('EMAIL_HOST'),
        port: Number(requireEnv('EMAIL_PORT')),
        secure: EMAIL_SECURE === 'true',
        auth: {
            user: requireEnv('EMAIL_USER'),
            pass: requireEnv('EMAIL_PASS')
        }
    });
}

function validateEnvironment() {
    const requiredVars = [
        'EMAIL_HOST',
        'EMAIL_PORT',
        'EMAIL_USER',
        'EMAIL_PASS',
        'BOOKING_TO_EMAIL'
    ];

    const missing = requiredVars.filter(key => !process.env[key]);
    if (missing.length > 0) {
        console.error('The backend cannot start because these environment variables are missing:', missing.join(', '));
        console.error('Copy .env.example to .env and fill in the missing values.');
        process.exit(1);
    }
}

const app = express();
app.use(express.json());
app.use(cors({
    origin: FRONTEND_ORIGIN || '*'
}));

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', environment: process.env.NODE_ENV || 'development' });
});

app.post('/api/book-service', async (req, res) => {
    try {
        console.log('Received booking request:', req.body);

        const payload = {
            customer_name: (req.body.customer_name || '').trim(),
            phone_number: (req.body.phone_number || '').trim(),
            email_address: (req.body.email_address || '').trim(),
            service_type: (req.body.service_type || '').trim(),
            message: (req.body.message || 'No additional message provided').trim()
        };

        const validationErrors = validateBookingPayload(payload);
        if (validationErrors.length > 0) {
            console.warn('Booking validation failed:', validationErrors);
            return res.status(400).json({ success: false, errors: validationErrors });
        }

        const transporter = createTransporter();
        const mailOptions = {
            from: EMAIL_FROM || EMAIL_USER,
            to: requireEnv('BOOKING_TO_EMAIL'),
            subject: `New Service Booking Request from ${payload.customer_name}`,
            text: `New service booking request received:\n\n` +
                `Customer Name: ${payload.customer_name}\n` +
                `Phone Number: ${payload.phone_number}\n` +
                `Email Address: ${payload.email_address}\n` +
                `Service Type: ${payload.service_type}\n\n` +
                `Message:\n${payload.message}\n`,
            html: `<h2>New Service Booking Request</h2>` +
                `<p><strong>Customer Name:</strong> ${payload.customer_name}</p>` +
                `<p><strong>Phone Number:</strong> ${payload.phone_number}</p>` +
                `<p><strong>Email Address:</strong> ${payload.email_address}</p>` +
                `<p><strong>Service Type:</strong> ${payload.service_type}</p>` +
                `<p><strong>Message:</strong><br>${payload.message.replace(/\n/g, '<br>')}</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Booking email sent successfully:', info.messageId);

        return res.status(200).json({ success: true, message: 'Booking request sent successfully.' });
    } catch (error) {
        console.error('Failed to send booking request:', error);
        return res.status(500).json({
            success: false,
            error: 'Unable to send your booking request at this time. Please try again later.'
        });
    }
});

app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({ success: false, error: 'An internal error occurred.' });
});

validateEnvironment();

const port = Number(PORT || 3000);
app.listen(port, () => {
    console.log(`Booking backend listening on http://localhost:${port}`);
});
