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

                // Add CSP headers for security
                res.header("Content-Security-Policy", 
                    "default-src 'self'; " +
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; " +
                    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
                    "media-src 'self' blob: https://*.windows.net; " + 
                    "connect-src 'self' https://*.axprod.net https://*.windows.net https://developer.axinom.com; " +
                    "img-src 'self' data: blob:;"
                );

                res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>${video.name} - DRM Player</title>
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
                        <video id="video" controls playsinline></video>
                        <script>
                            async function init() {
                                const video = document.getElementById('video');
                                
                                // Check if Safari
                                const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                                console.log('Browser detected:', isSafari ? 'Safari' : 'Other');

                                if (!shaka.Player.isBrowserSupported()) {
                                    console.error('Browser not supported for DRM playback');
                                    return;
                                }

                                try {
                                    const player = new shaka.Player(video);

                                    // Error handling
                                    player.addEventListener('error', (event) => {
                                        console.error('Player error:', event.detail);
                                        const errorDiv = document.createElement('div');
                                        errorDiv.className = 'error-message';
                                        errorDiv.textContent = 'Player error: ' + event.detail.message;
                                        document.body.appendChild(errorDiv);
                                    });

                                    shaka.polyfill.installAll();

                                    // First fetch the FairPlay certificate if using Safari
                                    let fairplayCertificate;
                                    if (isSafari) {
                                        try {
                                            console.log('Fetching FairPlay certificate...');
                                            const certResponse = await fetch('https://8d86a98a0a9426a560f8d992.blob.core.windows.net/web/fairplay.cer');
                                            if (!certResponse.ok) throw new Error('Failed to fetch certificate');
                                            fairplayCertificate = new Uint8Array(await certResponse.arrayBuffer());
                                            console.log('FairPlay certificate loaded');
                                        } catch (error) {
                                            console.error('Error loading FairPlay certificate:', error);
                                            throw error;
                                        }
                                    }

                                    // Configure DRM
                                    const drmConfig = {
                                        drm: {
                                            servers: {
                                                'com.widevine.alpha': 'https://drm-widevine-licensing.axprod.net/AcquireLicense',
                                                'com.microsoft.playready': 'https://drm-playready-licensing.axprod.net/AcquireLicense',
                                                'com.apple.fps.1_0': 'https://drm-fairplay-licensing.axprod.net/AcquireLicense'
                                            },
                                            advanced: {
                                                'com.apple.fps.1_0': {
                                                    serverCertificate: fairplayCertificate,
                                                    persistentStateRequired: true,
                                                    distinctiveIdentifierRequired: false
                                                }
                                            },
                                            initDataTransform: (initData, initDataType, drmInfo) => {
                                                if (isSafari && initDataType === 'skd') {
                                                    const contentId = shaka.util.FairPlayUtils.contentIdFromInitData(initData);
                                                    const cert = drmInfo.serverCertificate;
                                                    return shaka.util.FairPlayUtils.initDataTransform(initData, contentId, cert);
                                                }
                                                return initData;
                                            }
                                        }
                                    };

                                    player.configure(drmConfig);

                                    console.log('Fetching license token...');
                                    const tokenResponse = await fetch('/api/authorization/${encodeURIComponent(video.name)}');
                                    if (!tokenResponse.ok) {
                                        throw new Error('Failed to get license token');
                                    }
                                    const token = await tokenResponse.text();
                                    console.log('Token received');

                                    player.getNetworkingEngine().registerRequestFilter(function(type, request) {
                                        if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
                                            request.headers['X-AxDRM-Message'] = token;
                                            console.log('Added license token to request');
                                        }
                                    });

                                    // Use appropriate manifest URL based on browser
                                    const manifestUrl = isSafari ? '${video.hlsUrl}' : '${video.url}';
                                    console.log('Loading manifest:', manifestUrl);
                                    
                                    await player.load(manifestUrl);
                                    console.log('Video loaded successfully');
                                    
                                    video.play().catch(error => {
                                        console.log('Auto-play prevented:', error);
                                    });
                                    
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
