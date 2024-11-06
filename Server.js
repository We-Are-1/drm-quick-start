#!/usr/bin/env node

(function () {
    "use strict";

    require('dotenv').config();
    const port = process.env.PORT || 8120;
    const cors = require('cors');
    const express = require("express");
    const app = express();

    // CORS configuration
    const corsOptions = {
        origin: [
            'https://weare1media.com',
            'https://*.weare1media.com',  // Allow all subdomains
            'http://localhost:8120',      // For local testing
            'https://axinom-drm-player.onrender.com'
        ],
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'X-AxDRM-Message'],
        credentials: true
    };

    // Apply CORS to all routes
    app.use(cors(corsOptions));

    // Rest of your existing code...
    app.disable("etag");
    // ... other routes
})();
