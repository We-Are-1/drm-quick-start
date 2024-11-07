// PlayerRoutes.js & EmbedRoutes.js
// The core player logic should be the same in both files, just with different styling

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
                                    // Install legacy FairPlay support for Safari
                                    if (isSafari) {
                                        shaka.polyfill.PatchedMediaKeysApple.install(/* enableUninstall= */ true);
                                    }
                                    
                                    // Install all other polyfills
                                    await shaka.polyfill.installAll();

                                    if (!shaka.Player.isBrowserSupported()) {
                                        throw new Error('Browser not supported for DRM playback');
                                    }

                                    const player = new shaka.Player(video);

                                    // Player configuration
                                    const playerConfig = {
                                        streaming: {
                                            bufferingGoal: 10,
                                            rebufferingGoal: 2,
                                            bufferBehind: 30,
                                            ignoreTextStreamFailures: true,
                                            alwaysStreamText: true,
                                            useNativeHlsOnSafari: true
                                        },
                                        drm: {
                                            servers: {
                                                'com.apple.fps.1_0': 'https://drm-fairplay-licensing.axprod.net/AcquireLicense',
                                                'com.apple.fps': 'https://drm-fairplay-licensing.axprod.net/AcquireLicense',
                                                'com.widevine.alpha': 'https://drm-widevine-licensing.axprod.net/AcquireLicense',
                                                'com.microsoft.playready': 'https://drm-playready-licensing.axprod.net/AcquireLicense'
                                            }
                                        }
                                    };

                                    player.configure(playerConfig);

                                    // Get license token
                                    const tokenResponse = await fetch('/api/authorization/${encodeURIComponent(video.name)}', {
                                        credentials: 'include'
                                    });
                                    
                                    if (!tokenResponse.ok) {
                                        throw new Error('Failed to get license token');
                                    }
                                    
                                    const token = await tokenResponse.text();

                                    // Load FairPlay certificate for Safari
                                    if (isSafari) {
                                        try {
                                            const certResponse = await fetch('https://8d86a98a0a9426a560f8d992.blob.core.windows.net/web/fairplay.cer');
                                            if (!certResponse.ok) throw new Error('Failed to fetch certificate');
                                            const certBuffer = await certResponse.arrayBuffer();
                                            const cert = new Uint8Array(certBuffer);
                                            
                                            player.configure('drm.advanced.\'com.apple.fps.1_0\'.serverCertificate', cert);
                                            player.configure('drm.advanced.\'com.apple.fps\'.serverCertificate', cert);
                                        } catch (error) {
                                            console.error('Error loading FairPlay certificate:', error);
                                            throw error;
                                        }
                                    }

                                    // Configure DRM init data transform for FairPlay
                                    player.configure('drm.initDataTransform', (initData, initDataType, drmInfo) => {
                                        if (isSafari && initDataType === 'skd') {
                                            const contentId = shaka.util.FairPlayUtils.defaultGetContentId(initData);
                                            const cert = drmInfo.serverCertificate;
                                            return shaka.util.FairPlayUtils.initDataTransform(initData, contentId, cert);
                                        }
                                        return initData;
                                    });

                                    // Configure license request handling
                                    player.getNetworkingEngine().registerRequestFilter((type, request) => {
                                        if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
                                            request.headers['X-AxDRM-Message'] = token;
                                            
                                            if (isSafari) {
                                                // Format the license request for FairPlay
                                                const originalPayload = new Uint8Array(request.body);
                                                const base64Payload = shaka.util.Uint8ArrayUtils.toStandardBase64(originalPayload);
                                                const params = 'spc=' + encodeURIComponent(base64Payload);
                                                
                                                request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                                                request.body = shaka.util.StringUtils.toUTF8(params);
                                                
                                                console.log('FairPlay license request prepared');
                                            }
                                        }
                                    });

                                    // Configure license response handling for FairPlay
                                    if (isSafari) {
                                        player.getNetworkingEngine().registerResponseFilter((type, response) => {
                                            if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
                                                let responseText = shaka.util.StringUtils.fromUTF8(response.data);
                                                responseText = responseText.trim();
                                                
                                                // Handle CKC wrapper if present
                                                if (responseText.substr(0, 5) === '<ckc>' && responseText.substr(-6) === '</ckc>') {
                                                    responseText = responseText.slice(5, -6);
                                                }
                                                
                                                response.data = shaka.util.Uint8ArrayUtils.fromBase64(responseText).buffer;
                                                console.log('FairPlay license response processed');
                                            }
                                        });
                                    }

                                    // Load content
                                    const manifestUrl = isSafari ? '${video.hlsUrl}' : '${video.url}';
                                    console.log('Loading manifest:', manifestUrl);
                                    await player.load(manifestUrl);
                                    console.log('Content loaded successfully');

                                    // Handle play event specially for Safari
                                    if (isSafari) {
                                        video.addEventListener('play', () => {
                                            const playPromise = video.play();
                                            if (playPromise !== undefined) {
                                                playPromise.catch(error => {
                                                    console.log('Playback prevented until user interaction:', error);
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
                                if (message.includes('undefined')) {
                                    userMessage = 'Unable to initialize video playback. Please try refreshing the page.';
                                } else if (message.includes('FairPlay')) {
                                    userMessage = 'Please ensure FairPlay DRM is enabled in your Safari settings.';
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
