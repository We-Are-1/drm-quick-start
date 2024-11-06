#!/usr/bin/env node

(function () {
    "use strict";

    require('dotenv').config();
    const port = process.env.PORT || 8120;

    let express = require("express");
    let app = express();
    
    // Existing requires
    let catalogApi = require("./CatalogApi");
    let entitlementService = require("./EntitlementService");
    // Add this new require
    let playerRoutes = require("./PlayerRoutes");

    app.disable("etag");

    // Existing routes
    app.use(express.static(__dirname + '/Website'));
    app.use("/api/catalog", catalogApi.createRouter());
    app.use("/api/authorization", entitlementService.createRouter());
    
    // Add this new route
    app.use("/player", playerRoutes.createRouter());

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
