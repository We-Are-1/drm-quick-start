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
                        <title>${video.name}</title>
                        <script src="https://cdn.jsdelivr.net/npm/shaka-player@4.3.5/dist/shaka-player.compiled.min.js"></script>
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/shaka-player@4.3.5/dist/controls.min.css"/>
                        <style>
                            body { margin: 0; padding: 0; background: #000; overflow: hidden; }
                            #video { width: 100vw; height: 100vh; }
                        </style>
                    </head>
                    <body>
                        <video id="video" controls></video>
                        <script>
                            async function init() {
                                const video = document.getElementById('video');
                                const player = new shaka.Player(video);

                                shaka.polyfill.installAll();

                                player.configure({
                                    drm: {
                                        servers: {
                                            'com.widevine.alpha': 'https://drm-widevine-licensing.axprod.net/AcquireLicense',
                                            'com.microsoft.playready': 'https://drm-playready-licensing.axprod.net/AcquireLicense'
                                        }
                                    }
                                });

                                try {
                                    const tokenResponse = await fetch('/api/authorization/${encodeURIComponent(video.name)}', {
                                        credentials: 'include'
                                    });
                                    if (!tokenResponse.ok) throw new Error('Failed to get license token');
                                    const token = await tokenResponse.text();

                                    player.getNetworkingEngine().registerRequestFilter(function(type, request) {
                                        if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
                                            request.headers['X-AxDRM-Message'] = token;
                                        }
                                    });

                                    await player.load('${video.url}');
                                    
                                    // Attempt to play
                                    try {
                                        await video.play();
                                    } catch (error) {
                                        console.log('Auto-play prevented:', error);
                                    }

                                } catch (error) {
                                    console.error('Error:', error);
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
