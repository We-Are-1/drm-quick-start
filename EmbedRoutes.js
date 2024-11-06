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
                            }
                        </style>
                    </head>
                    <body>
                        <video id="video" controls playsinline></video>
                        <div id="error-display"></div>
                        <script>
                            async function init() {
                                const video = document.getElementById('video');
                                const errorDisplay = document.getElementById('error-display');
                                
                                // Check if it's Safari
                                const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                                console.log('Browser detected:', isSafari ? 'Safari' : 'Other');

                                if (!shaka.Player.isBrowserSupported()) {
                                    showError('Browser not supported for DRM playback');
                                    return;
                                }

                                try {
                                    const player = new shaka.Player(video);
                                    
                                    player.addEventListener('error', (event) => {
                                        console.error('Player error:', event.detail);
                                        showError('Player error: ' + event.detail.message);
                                    });

                                    shaka.polyfill.installAll();

                                    // Configure DRM based on browser
                                    const drmConfig = {
                                        drm: {
                                            servers: {
                                                'com.widevine.alpha': 'https://drm-widevine-licensing.axprod.net/AcquireLicense',
                                                'com.microsoft.playready': 'https://drm-playready-licensing.axprod.net/AcquireLicense',
                                                'com.apple.fps': 'https://drm-fairplay-licensing.axprod.net/AcquireLicense'
                                            },
                                            advanced: {
                                                'com.apple.fps': {
                                                    serverCertificate: await getFairPlayCertificate()
                                                }
                                            }
                                        }
                                    };

                                    player.configure(drmConfig);

                                    console.log('Fetching license token...');
                                    const tokenResponse = await fetch('/api/authorization/${encodeURIComponent(video.name)}', {
                                        credentials: 'include'
                                    });
                                    
                                    if (!tokenResponse.ok) {
                                        throw new Error('Failed to get license token: ' + tokenResponse.status);
                                    }
                                    
                                    const token = await tokenResponse.text();
                                    console.log('Token received');

                                    player.getNetworkingEngine().registerRequestFilter((type, request) => {
                                        if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
                                            request.headers['X-AxDRM-Message'] = token;
                                            console.log('Added license token to request');
                                        }
                                    });

                                    // Use HLS URL for Safari, DASH for others
                                    const manifestUrl = isSafari ? '${video.hlsUrl}' : '${video.url}';
                                    console.log('Loading manifest:', manifestUrl);
                                    await player.load(manifestUrl);
                                    console.log('Manifest loaded successfully');

                                    video.play().catch(error => {
                                        console.log('Auto-play prevented:', error);
                                        showError('Click to play the video');
                                    });

                                } catch (error) {
                                    console.error('Detailed error:', error);
                                    showError(error.message || 'Failed to initialize player');
                                }
                            }

                            async function getFairPlayCertificate() {
                                try {
                                    const response = await fetch('https://developer.axinom.com/certificate/certificate.der');
                                    const cert = await response.arrayBuffer();
                                    return new Uint8Array(cert);
                                } catch (error) {
                                    console.error('Error loading FairPlay certificate:', error);
                                    throw error;
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
