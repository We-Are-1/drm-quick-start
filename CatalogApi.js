(function () {
    "use strict";

    require('dotenv').config();
    let express = require("express");
    let videoDatabase = require("./VideoDatabase");

    module.exports = {
        "createRouter": function createRouter() {
            let router = express.Router();

            router.get("/videos", function processGet(request, response) {
                response.header("Cache-Control", "no-cache");
                
                // Optional: Basic API key check if configured
                const apiKey = request.headers['x-api-key'];
                if (process.env.CATALOG_API_KEY && apiKey !== process.env.CATALOG_API_KEY) {
                    return response.status(401).json({ error: "Unauthorized" });
                }

                let videoList = [];

                videoDatabase.getAllVideos().forEach(function mapVideo(video) {
                    videoList.push({
                        "name": video.name,
                        "url": video.url,
                        "tags": video.tags
                    });
                });                

                response.json(videoList);
            });

            return router;
        }
    };
})();
