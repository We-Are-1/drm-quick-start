// For both PlayerRoutes.js and EmbedRoutes.js
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
                        <title>${video.name}${req.baseUrl.includes('embed') ? '' : ' - Player'}</title>
                        <meta charset="utf-8">
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
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
                            /* Custom player UI styles */
                            .shaka-play-button[icon="play"] {
                                background-color: #FFAF48 !important;
                                border-radius: 50%;
                            }
                            .shaka-volume-bar-container {
                                accent-color: #FFAF48 !important;
                            }
                            .shaka-controls button:hover {
                                background-color: #FFAF48 !important;
                            }
                            /* Hide unnecessary controls */
                            .shaka-playback-rates,
                            .shaka-captions-button {
                                display: none !important;
                            }
                            /* Style quality selection */
                            .shaka-resolutions {
                                display: block !important;
                            }
                            .shaka-resolutions button {
                                color: white;
                            }
                            .shaka-current-selection-span {
                                color: #FFAF48;
                            }
                        </style>
                    </head>
                    <body>
                        <video id="video" controls playsinline autoplay="false"></video>
                        <div id="error-display"></div>
                        <script>
                            async function init() {
                                const video = document.getElementById('video');
                                video.autoplay = false;
                                const errorDisplay = document.getElementById('error-display');
                                
                                const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                                console.log('Browser detected:', isSafari ? 'Safari' : 'Other');

                                try {
                                    if (isSafari) {
                                        console.log('Installing FairPlay support...');
                                        shaka.polyfill.PatchedMediaKeysApple.install(/* enableUninstall= */ true);
                                    }
                                    
                                    await shaka.polyfill.installAll();

                                    if (!shaka.Player.isBrowserSupported()) {
                                        throw new Error('Browser not supported for DRM playback');
                                    }

                                    const player = new shaka.Player(video);

                                    // Enhanced error handling
                                    player.addEventListener('error', (event) => {
                                        console.error('Player error:', event.detail);
                                        showError(event.detail.message);
                                    });

                                    // Basic configuration
                                    const basicConfig = {
                                        streaming: {
                                            bufferingGoal: 10,
                                            rebufferingGoal: 2,
                                            bufferBehind: 30,
                                            ignoreTextStreamFailures: true,
                                            alwaysStreamText: true,
                                            useNativeHlsOnSafari: true,
                                            retryParameters: {
                                                timeout: 30000,
                                                maxAttempts: 2,
                                                baseDelay: 1000,
                                                backoffFactor: 2,
                                                fuzzFactor: 0.5
                                            }
                                        },
                                        drm: {
                                            servers: {
                                                'com.apple.fps.1_0': 'https://99b94032.drm-fairplay-licensing.axprod.net/AcquireLicense',
                                                'com.apple.fps': 'https://99b94032.drm-fairplay-licensing.axprod.net/AcquireLicense',
                                                'com.widevine.alpha': 'https://99b94032.drm-widevine-licensing.axprod.net/AcquireLicense',
                                                'com.microsoft.playready': 'https://99b94032.drm-playready-licensing.axprod.net/AcquireLicense'
                                            },
                                            advanced: {
                                                'com.winevine.alpha': {
                                                    'videoRobustness': 'HW_SECURE_DECODE'
                                                }
                                            }    
                                        }
                                    };

                                    console.log('Applying basic configuration...');
                                    player.configure(basicConfig);

                                    // Get license token
                                    console.log('Fetching license token...');
                                    const tokenResponse = await fetch('/api/authorization/${encodeURIComponent(video.name)}', {
                                        credentials: 'include'
                                    });
                                    
                                    if (!tokenResponse.ok) {
                                        throw new Error('Failed to get license token');
                                    }
                                    
                                    const token = await tokenResponse.text();
                                    console.log('Token received successfully');

                                    // Safari/FairPlay specific setup
                                    if (isSafari) {
                                        try {
                                            console.log('Setting up FairPlay...');
                                            
                                            const certResponse = await fetch('https://8d86a98a0a9426a560f8d992.blob.core.windows.net/web/fairplay.cer');
                                            if (!certResponse.ok) throw new Error('Failed to fetch FairPlay certificate');
                                            const certBuffer = await certResponse.arrayBuffer();
                                            const cert = new Uint8Array(certBuffer);
                                            
                                            console.log('FairPlay certificate loaded');
                                            
                                            player.configure({
                                                drm: {
                                                    advanced: {
                                                        'com.apple.fps.1_0': {
                                                            serverCertificate: cert
                                                        },
                                                        'com.apple.fps': {
                                                            serverCertificate: cert
                                                        }
                                                    }
                                                }
                                            });

                                            // Configure license request handling for FairPlay
                                            player.getNetworkingEngine().registerRequestFilter((type, request) => {
                                                if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
                                                    // Set correct headers for FairPlay
                                                    request.headers['X-AxDRM-Message'] = token;
                                                    request.headers['Content-Type'] = 'application/octet-stream';
                                                    
                                                    // Do not modify the request body - keep it as binary
                                                    console.log('FairPlay license request prepared');
                                                }
                                            });

                                            // Configure license response handling for FairPlay
                                            player.getNetworkingEngine().registerResponseFilter((type, response) => {
                                                if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
                                                    // Only process if we receive a CKC response
                                                    const responseText = shaka.util.StringUtils.fromUTF8(response.data);
                                                    if (responseText.includes('<ckc>')) {
                                                        console.log('Processing CKC response');
                                                        const trimmed = responseText.replace(/<ckc>|<\\/ckc>/g, '').trim();
                                                        response.data = shaka.util.Uint8ArrayUtils.fromBase64(trimmed).buffer;
                                                    }
                                                }
                                            });

                                        } catch (error) {
                                            console.error('FairPlay setup error:', error);
                                            throw error;
                                        }
                                    } else {
                                        // Non-Safari DRM setup
                                        player.getNetworkingEngine().registerRequestFilter((type, request) => {
                                            if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
                                                request.headers['X-AxDRM-Message'] = token;
                                            }
                                        });
                                    }

                                    // Load content
                                    const manifestUrl = isSafari ? '${video.hlsUrl}' : '${video.url}';
                                    console.log('Loading manifest:', manifestUrl);
                                    
                                    // Safari-specific configurations
                                    if (isSafari) {
                                        player.configure('streaming.useNativeHlsOnSafari', true);
                                    }

                                    await player.load(manifestUrl);
                                    console.log('Content loaded successfully');

                                    // Handle play event for Safari
                                    if (isSafari) {
                                        video.addEventListener('play', () => {
                                            const playPromise = video.play();
                                            if (playPromise !== undefined) {
                                                playPromise.catch(error => {
                                                    if (error.name === 'NotAllowedError') {
                                                        console.log('Playback requires user interaction first');
                                                    } else {
                                                        console.error('Play error:', error);
                                                        showError('Playback failed. Please try again.');
                                                    }
                                                });
                                            }
                                        });
                                    }

                                } catch (error) {
                                    console.error('Setup error:', error);
                                    showError(error.message || 'Failed to initialize player');
                                }
                            }

                            function showError(message) {
                                const errorDisplay = document.getElementById('error-display');
                                let userMessage = message;
                                
                                if (message.includes('Failed to fetch')) {
                                    userMessage = 'Unable to load video resources. Please check your connection.';
                                } else if (message.includes('FairPlay')) {
                                    userMessage = 'Please ensure FairPlay DRM is enabled in your Safari settings.';
                                } else if (message.includes('license')) {
                                    userMessage = 'Unable to verify video license. Please try refreshing the page.';
                                }
                                
                                errorDisplay.textContent = userMessage;
                                errorDisplay.style.display = 'block';
                                console.warn('Player Error:', message);
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