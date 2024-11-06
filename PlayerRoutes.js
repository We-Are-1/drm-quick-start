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
                        <title>${video.name} - DRM Player</title>
                        <script src="https://cdn.jsdelivr.net/npm/shaka-player@4.3.5/dist/shaka-player.compiled.min.js"></script>
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/shaka-player@4.3.5/dist/controls.min.css"/>
                        <style>
                            body { margin: 0; padding: 0; background: #000; }
                            #video { width: 100%; height: 100vh; }
                            .error-message { 
                                position: fixed;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                color: white; 
                                padding: 20px; 
                                text-align: center; 
                                font-family: Arial, sans-serif;
                                background: rgba(0,0,0,0.8);
                                border-radius: 5px;
                                z-index: 1000;
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
                                        if (isSafari) {
                                            console.log('Safari DRM Status:', {
                                                'EME Support': !!window.MediaKeys,
                                                'FairPlay Support': navigator.requestMediaKeySystemAccess ? true : false,
                                                'Error Code': event.detail.code,
                                                'Error Category': event.detail.category,
                                                'Error Message': event.detail.message
                                            });
                                        }
                                        
                                        // More specific error message for Safari FairPlay issues
                                        if (isSafari && event.detail.code === 6010) {
                                            showError('Please ensure FairPlay DRM is enabled in your Safari settings');
                                        } else {
                                            console.warn('Player error:', event.detail.message);
                                            console.warn('Error details:', event.detail);
                                            showError(event.detail.message);
                                        }
                                    });

                                    // First fetch the FairPlay certificate if using Safari
                                    let fairplayCertificate;
                                    if (isSafari) {
                                        try {
                                            console.log('Fetching FairPlay certificate...');
                                            const certResponse = await fetch('https://8d86a98a0a9426a560f8d992.blob.core.windows.net/web/fairplay.cer');
                                            if (!certResponse.ok) throw new Error('Failed to fetch certificate');
                                            fairplayCertificate = new Uint8Array(await certResponse.arrayBuffer());
                                            console.log('FairPlay certificate loaded successfully', fairplayCertificate);
                                        } catch (error) {
                                            console.error('Error loading FairPlay certificate:', error);
                                            throw error;
                                        }
                                    }

                                    // Configure DRM with updated FairPlay settings
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
                                                    console.log('Transforming FairPlay init data');
                                                    const contentId = shaka.util.FairPlayUtils.contentIdFromInitData(initData);
                                                    const cert = drmInfo.serverCertificate;
                                                    return shaka.util.FairPlayUtils.initDataTransform(initData, contentId, cert);
                                                }
                                                return initData;
                                            }
                                        },
                                        streaming: {
                                            useNativeHlsOnSafari: true,
                                            alwaysStreamText: true,
                                            rebufferingGoal: 2
                                        },
                                        manifest: {
                                            dash: {
                                                ignoreMinBufferTime: true
                                            },
                                            hls: {
                                                ignoreMinBufferTime: true
                                            }
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

                                    // Register request and response filters for license requests
                                    player.getNetworkingEngine().registerRequestFilter((type, request) => {
                                        if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
                                            request.headers['X-AxDRM-Message'] = token;
                                            
                                            if (isSafari) {
                                                // Add specific headers for FairPlay
                                                request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                                                console.log('Added FairPlay headers to license request');
                                            }
                                            
                                            console.log('License request headers:', request.headers);
                                        }
                                    });

                                    // Add response filter specifically for Safari
                                    if (isSafari) {
                                        player.getNetworkingEngine().registerResponseFilter((type, response) => {
                                            if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
                                                console.log('Processing FairPlay license response');
                                                // Ensure proper handling of FairPlay license response
                                                if (response.data) {
                                                    console.log('License response received');
                                                }
                                            }
                                        });
                                    }

                                    // Use appropriate manifest URL based on browser
                                    const manifestUrl = isSafari ? '${video.hlsUrl}' : '${video.url}';
                                    console.log('Loading manifest for ' + (isSafari ? 'Safari/HLS' : 'Other/DASH') + ':', manifestUrl);
                                    
                                    try {
                                        if (isSafari) {
                                            console.log('Configuring Safari-specific settings');
                                            player.configure({
                                                streaming: {
                                                    useNativeHlsOnSafari: true
                                                }
                                            });
                                        }
                                        
                                        await player.load(manifestUrl);
                                        console.log('Manifest loaded successfully');
                                    } catch (loadError) {
                                        console.error('Manifest load error:', loadError);
                                        if (isSafari) {
                                            console.error('Safari specific error details:', {
                                                'URL Type': 'HLS',
                                                'Manifest URL': manifestUrl,
                                                'Error Type': loadError.name,
                                                'Error Message': loadError.message
                                            });
                                        }
                                        throw loadError;
                                    }

                                } catch (error) {
                                    console.error('Setup error:', error);
                                    showError(error.message || 'Failed to initialize player');
                                }
                            }

                            function showError(message) {
                                const errorDiv = document.createElement('div');
                                errorDiv.className = 'error-message';
                                
                                // Make error messages more user-friendly
                                let userMessage = message;
                                if (message.includes('undefined')) {
                                    userMessage = 'Unable to initialize video playback. Please try refreshing the page.';
                                } else if (message.includes('FairPlay')) {
                                    userMessage = 'Please ensure FairPlay DRM is enabled in your Safari settings.';
                                }
                                
                                errorDiv.textContent = userMessage;
                                document.body.appendChild(errorDiv);
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
