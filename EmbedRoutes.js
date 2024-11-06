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

                // Updated CSP headers
                res.header("Content-Security-Policy", 
                    "default-src 'self'; " +
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; " +
                    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; " +
                    "font-src 'self' https://fonts.gstatic.com; " +
                    "media-src 'self' blob: https://*.windows.net; " + 
                    "connect-src 'self' https://*.axprod.net https://*.windows.net https://developer.axinom.com; " +
                    "img-src 'self' data: blob:;"
                );

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
                            #error-display {
                                position: fixed;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                background: rgba(0,0,0,0.8);
                                color: white;
                                padding: 20px;
                                border-radius: 5px;
                                display: none;
                                z-index: 1000;
                                font-family: Arial, sans-serif;
                            }
                        </style>
                    </head>
                    <body>
                        <video id="video" controls playsinline></video>
                        <div id="error-display"></div>
                        <script>
                            async function init() {
                                const video = document.getElementById('video');
                                
                                // Check if Safari
                                const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                                console.log('Browser detected:', isSafari ? 'Safari' : 'Other');

                                try {
                                    // Install polyfills first
                                    await shaka.polyfill.installAll();

                                    // Check browser support after polyfills
                                    if (!shaka.Player.isBrowserSupported()) {
                                        throw new Error('Browser not supported for DRM playback');
                                    }

                                    const player = new shaka.Player(video);

                                    // Enable more detailed error logging
                                    player.addEventListener('error', (event) => {
                                        console.error('Player error:', event);
                                        console.error('Error details:', event.detail);
                                        showError('Player error: ' + event.detail.message);
                                    });

                                    // First fetch the FairPlay certificate if using Safari
                                    let fairplayCertificate;
                                    if (isSafari) {
                                        try {
                                            console.log('Fetching FairPlay certificate...');
                                            const certResponse = await fetch('https://8d86a98a0a9426a560f8d992.blob.core.windows.net/web/fairplay.cer');
                                            if (!certResponse.ok) throw new Error('Failed to fetch certificate');
                                            fairplayCertificate = new Uint8Array(await certResponse.arrayBuffer());
                                            console.log('FairPlay certificate loaded successfully');
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
                                        },
                                        streaming: {
                                            bufferingGoal: 60,
                                            rebufferingGoal: 30,
                                            bufferBehind: 30
                                        },
                                        abr: {
                                            enabled: true,
                                            defaultBandwidthEstimate: 1000000
                                        }
                                    };

                                    // Configure player
                                    player.configure(drmConfig);

                                    // Get license token
                                    console.log('Fetching license token...');
                                    const tokenResponse = await fetch('/api/authorization/${encodeURIComponent(video.name)}', {
                                        credentials: 'include'
                                    });
                                    
                                    if (!tokenResponse.ok) {
                                        throw new Error('Failed to get license token: ' + tokenResponse.status);
                                    }
                                    
                                    const token = await tokenResponse.text();
                                    console.log('Token received successfully');

                                    // Register request filter for license requests
                                    player.getNetworkingEngine().registerRequestFilter((type, request) => {
                                        if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
                                            request.headers['X-AxDRM-Message'] = token;
                                            console.log('Added license token to request');
                                        }
                                    });

                                    // Use appropriate manifest URL based on browser
                                    const manifestUrl = isSafari ? '${video.hlsUrl}' : '${video.url}';
                                    console.log('Loading manifest:', manifestUrl);
                                    
                                    try {
                                        await player.load(manifestUrl);
                                        console.log('Manifest loaded successfully');

                                        // Try to play
                                        try {
                                            await video.play();
                                            console.log('Playback started');
                                        } catch (playError) {
                                            console.log('Auto-play prevented:', playError);
                                            showError('Click to play the video');
                                        }
                                    } catch (loadError) {
                                        console.error('Manifest load error:', loadError);
                                        throw loadError;
                                    }

                                } catch (error) {
                                    console.error('Setup error:', error);
                                    showError(error.message || 'Failed to initialize player');
                                }
                            }

                            function showError(message) {
                                const errorDisplay = document.getElementById('error-display');
                                errorDisplay.textContent = message;
                                errorDisplay.style.display = 'block';
                                console.error('Player Error:', message);
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
