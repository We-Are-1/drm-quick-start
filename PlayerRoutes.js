(function () {
    "use strict";

    require('dotenv').config();
    let express = require("express");
    let videoDatabase = require("./VideoDatabase");

    module.exports = {
        "createRouter": function createRouter() {
            let router = express.Router();

            router.get("/:videoId", function (req, res) {
                const videos = videoDatabase.getAllVideos();
                const video = videos[parseInt(req.params.videoId) - 1];

                if (!video) {
                    return res.status(404).send("Video not found");
                }

                res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>${video.name} - Axinom DRM Player</title>
                        <script src="https://cdn.jsdelivr.net/npm/shaka-player@4.3.5/dist/shaka-player.compiled.min.js"></script>
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/shaka-player@4.3.5/dist/controls.min.css"/>
                        <style>
                            body { margin: 0; padding: 0; background: #000; }
                            #video { width: 100%; height: 100vh; }
                            .error-message { 
                                color: white; 
                                padding: 20px; 
                                text-align: center; 
                                font-family: Arial, sans-serif; 
                            }
                        </style>
                    </head>
                    <body>
                        <video id="video" controls></video>
                        <script>
                            async function init() {
                                const video = document.getElementById('video');
                                const player = new shaka.Player(video);

                                // Install built-in polyfills to patch browser incompatibilities.
                                shaka.polyfill.installAll();

                                // Configure DRM
                                player.configure({
                                    drm: {
                                        servers: {
                                            'com.widevine.alpha': 'https://drm-widevine-licensing.axprod.net/AcquireLicense',
                                            'com.microsoft.playready': 'https://drm-playready-licensing.axprod.net/AcquireLicense'
                                        }
                                    }
                                });

                                try {
                                    // Get the license token
                                    const tokenResponse = await fetch('/api/authorization/${encodeURIComponent(video.name)}');
                                    if (!tokenResponse.ok) {
                                        throw new Error('Failed to get license token');
                                    }
                                    const token = await tokenResponse.text();

                                    // Add the token to license requests
                                    player.getNetworkingEngine().registerRequestFilter(function(type, request) {
                                        if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
                                            request.headers['X-AxDRM-Message'] = token;
                                        }
                                    });

                                    // Load the manifest
                                    await player.load('${video.url}');
                                    console.log('Video loaded successfully');
                                    
                                } catch (error) {
                                    console.error('Error loading video:', error);
                                    const errorDiv = document.createElement('div');
                                    errorDiv.className = 'error-message';
                                    errorDiv.textContent = 'Error loading video. Please check console for details.';
                                    document.body.appendChild(errorDiv);
                                }
                            }

                            document.addEventListener('DOMContentLoaded', init);
                        </script>
                    </body>
                    </html>
                `);
            });

            return router;
        }
    };
})();