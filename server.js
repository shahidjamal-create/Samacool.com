require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const SMTP_HOST = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
const SMTP_PORT = process.env.SMTP_PORT || process.env.EMAIL_PORT || 465;
const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER || 'shahidjamal13258@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || process.env.EMAIL_PASS || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.BOOKING_TO_EMAIL || 'shahidjamal13258@gmail.com';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';
const PORT = process.env.PORT || 3000;

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
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    });
}

function validateEnvironment() {
    if (!SMTP_PASS || SMTP_PASS === 'your-gmail-app-password') {
        console.warn('NOTE: SMTP_PASS is not set in .env. Form submissions will also be handled directly via FormSubmit to ' + ADMIN_EMAIL);
    }
}

const app = express();
app.use(express.json());
app.use(cors({
    origin: FRONTEND_ORIGIN || '*'
}));

// Serve static frontend assets and HTML files
app.use(express.static(path.join(__dirname)));

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
            from: SMTP_USER,
            to: ADMIN_EMAIL,
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

app.post('/api/product-enquiry', async (req, res) => {
    try {
        console.log('Received product enquiry:', req.body);

        const payload = {
            product_name: (req.body.product_name || 'N/A').trim(),
            product_brand: (req.body.product_brand || 'N/A').trim(),
            product_category: (req.body.product_category || 'N/A').trim(),
            product_price: (req.body.product_price || 'N/A').trim(),
            customer_name: (req.body.customer_name || 'N/A').trim(),
            phone_number: (req.body.phone_number || 'N/A').trim(),
            email_address: (req.body.email_address || 'N/A').trim(),
            delivery_address: (req.body.delivery_address || 'N/A').trim(),
            message: (req.body.message || 'No additional message provided').trim(),
            enquiry_date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        };

        const errors = [];
        if (!payload.customer_name || payload.customer_name === 'N/A') errors.push('Customer name is required.');
        if (!payload.phone_number || !/^([6-9]\d{9})$/.test(payload.phone_number)) errors.push('A valid 10-digit Indian mobile number is required.');
        if (!payload.delivery_address || payload.delivery_address === 'N/A') errors.push('Delivery address is required.');

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const transporter = createTransporter();
        const mailOptions = {
            from: SMTP_USER,
            to: ADMIN_EMAIL,
            subject: `New Product Enquiry - ${payload.product_name}`,
            text: `SAMACOOL - New Product Order & Enquiry\n\n` +
                `Selected Product:\n` +
                `Product Name: ${payload.product_name}\n` +
                `Brand: ${payload.product_brand}\n` +
                `Category: ${payload.product_category}\n` +
                `Price: ${payload.product_price}\n\n` +
                `Customer Details:\n` +
                `Full Name: ${payload.customer_name}\n` +
                `Mobile Number: ${payload.phone_number}\n` +
                `Email: ${payload.email_address}\n\n` +
                `Delivery Address:\n` +
                `${payload.delivery_address}\n\n` +
                `Additional Message:\n` +
                `${payload.message}\n`,
            html: `<h2>SAMACOOL - New Product Order & Enquiry</h2>` +
                `<h3>Selected Product:</h3>` +
                `<p><strong>Product Name:</strong> ${payload.product_name}</p>` +
                `<p><strong>Brand:</strong> ${payload.product_brand}</p>` +
                `<p><strong>Category:</strong> ${payload.product_category}</p>` +
                `<p><strong>Price:</strong> ${payload.product_price}</p>` +
                `<h3>Customer Details:</h3>` +
                `<p><strong>Full Name:</strong> ${payload.customer_name}</p>` +
                `<p><strong>Mobile Number:</strong> ${payload.phone_number}</p>` +
                `<p><strong>Email:</strong> ${payload.email_address}</p>` +
                `<h3>Delivery Address:</h3>` +
                `<p>${payload.delivery_address.replace(/\n/g, '<br>')}</p>` +
                `<h3>Additional Message:</h3>` +
                `<p>${payload.message.replace(/\n/g, '<br>')}</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Product enquiry email sent successfully:', info.messageId);

        return res.status(200).json({ success: true, message: 'Enquiry submitted successfully. We will contact you soon.' });
    } catch (error) {
        console.error('Failed to send product enquiry:', error);
        return res.status(500).json({
            success: false,
            error: 'Unable to send your enquiry at this time. Please try again later.'
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
