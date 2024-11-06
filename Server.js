#!/usr/bin/env node

(function () {
    "use strict";

    // Add dotenv configuration at the top
    require('dotenv').config();

    // Update port configuration to use environment variable
    const port = process.env.PORT || 8120;

    // Create axinomCredentials object from environment variables
    const axinomCredentials = {
        communicationKeyId: process.env.AXINOM_COMMUNICATION_KEY_ID,
        communicationKey: process.env.AXINOM_COMMUNICATION_KEY
    };

    // Load credentials
    if (axinomCredentials.communicationKeyId && axinomCredentials.communicationKey) {
        console.log("Axinom credentials loaded from environment variables");
    } else {
        // Fallback to secrets file if env vars not found
        let secretManagement = require("./SecretManagement");
        secretManagement.tryLoadSecrets();
    }

    let express = require("express");
    let app = express();

    // We disable etag as it causes API calls to be cached even with Cache-Control: no-cache.
    app.disable("etag");

    // Configure CORS if needed
    if (process.env.ALLOWED_ORIGINS) {
        const cors = require('cors');
        app.use(cors({
            origin: process.env.ALLOWED_ORIGINS.split(','),
            methods: ['GET', 'POST'],
            credentials: true
        }));
    }

    // At /, we serve the website folder as static resources.
    app.use(express.static(__dirname + '/Website'));

    // At /api/catalog is the catalog API that provides data for the frontend.
    let catalogApi = require("./CatalogApi");
    app.use(process.env.CATALOG_API_URL || "/api/catalog", catalogApi.createRouter());

    // At /api/authorization is the Entitlement Service.
    let entitlementService = require("./EntitlementService");
    app.use(process.env.ENTITLEMENT_API_URL || "/api/authorization", entitlementService.createRouter());

    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
        if (process.env.NODE_ENV === 'production') {
            console.log(`Application is live at ${process.env.RENDER_EXTERNAL_URL || 'your-render-url'}`);
        } else {
            console.log(`Application is available at http://localhost:${port}`);
        }
        console.log("Press Control+C to shut down the application.");
    });
})();
