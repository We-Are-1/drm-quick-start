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

    // We disable etag as it causes API calls to be cached even with Cache-Control: no-cache.
    app.disable("etag");

    // Load all required modules
    let catalogApi = require("./CatalogApi");
    let entitlementService = require("./EntitlementService");
    let playerRoutes = require("./PlayerRoutes");
    let embedRoutes = require("./EmbedRoutes");  // Add this line

    // At /, we serve the website folder as static resources.
    app.use(express.static(__dirname + '/Website'));

    // At /api/catalog is the catalog API that provides data for the frontend.
    app.use("/api/catalog", catalogApi.createRouter());

    // At /api/authorization is the Entitlement Service.
    app.use("/api/authorization", entitlementService.createRouter());

    // Player routes for web viewing
    app.use("/player", playerRoutes.createRouter());

    // Embed routes for iframe embedding
    app.use("/embed", embedRoutes.createRouter());  // Add this line

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
        if (process.env.NODE_ENV === 'production') {
            console.log(`Application is live at ${process.env.RENDER_EXTERNAL_URL || 'your-render-url'}`);
        } else {
            console.log(`Application is available at http://localhost:${port}`);
        }
    });
})();
