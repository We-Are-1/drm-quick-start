// PlayerRoutes.js
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
                const bitmovinKey = process.env.BITMOVIN_PLAYER_LICENSE_KEY;

                if (!video) {
                    return res.status(404).send("Video not found");
                }

                if (!bitmovinKey) {
                    return res.status(500).send("Bitmovin license key not configured");
                }

                res.header("Content-Security-Policy", 
                    "default-src 'self'; " +
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.bitmovin.com; " +
                    "style-src 'self' 'unsafe-inline' https://cdn.bitmovin.com; " +
                    "media-src 'self' blob: https://*.windows.net; " + 
                    "connect-src 'self' https://*.axprod.net https://*.windows.net https://cdn.bitmovin.com https://licensing.bitmovin.com; " +
                    "img-src 'self' data: blob: https://cdn.bitmovin.com;"
                );

                res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>${video.name} - Player</title>
                        <script src="https://cdn.bitmovin.com/player/web/8/bitmovinplayer.js"></script>
                        <script src="https://cdn.bitmovin.com/analytics/web/2/bitmovinanalytics.min.js"></script>
                        <style>
                            body { margin: 0; padding: 0; background: #000; }
                            #player-container { width: 100%; height: 100vh; }
                            #error-display {
                                display: none;
                                position: fixed;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                background: rgba(0, 0, 0, 0.8);
                                color: white;
                                padding: 20px;
                                border-radius: 5px;
                                font-family: Arial, sans-serif;
                                z-index: 1000;
                                text-align: center;
                            }
                        </style>
                    </head>
                    <body>
                        <div id="player-container"></div>
                        <div id="error-display"></div>
                        
                        <script>
                            async function initPlayer() {
                                const playerConfig = {
                                    key: '${bitmovinKey}',
                                    playback: {
                                        autoplay: false,
                                        muted: false
                                    },
                                    analytics: {
                                        key: '${process.env.BITMOVIN_ANALYTICS_KEY || ''}',
                                        title: '${video.name}'
                                    },
                                    adaptation: {
                                        preload: false
                                    },
                                    events: {
                                        stallstarted: () => console.log('Loading...'),
                                        stallended: () => console.log('Loading complete'),
                                        warning: (warn) => console.warn('Player warning:', warn),
                                        error: (err) => handleError(err)
                                    }
                                };

                                try {
                                    console.log('Initializing Bitmovin Player...');
                                    const container = document.getElementById('player-container');
                                    const player = new bitmovin.player.Player(container, playerConfig);

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

                                    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                                    
                                    // Configure source with DRM
                                    const sourceConfig = {
                                        dash: isSafari ? undefined : '${video.url}',
                                        hls: isSafari ? '${video.hlsUrl}' : undefined,
                                        drm: {
                                            widevine: {
                                                LA_URL: 'https://drm-widevine-licensing.axprod.net/AcquireLicense',
                                                headers: {
                                                    'X-AxDRM-Message': token
                                                }
                                            },
                                            playready: {
                                                LA_URL: 'https://drm-playready-licensing.axprod.net/AcquireLicense',
                                                headers: {
                                                    'X-AxDRM-Message': token
                                                }
                                            },
                                            fairplay: {
                                                LA_URL: 'https://drm-fairplay-licensing.axprod.net/AcquireLicense',
                                                certificateURL: 'https://8d86a98a0a9426a560f8d992.blob.core.windows.net/web/fairplay.cer',
                                                headers: {
                                                    'X-AxDRM-Message': token
                                                },
                                                prepareMessage: function(keyMessageEvent, keySession) {
                                                    return keyMessageEvent;
                                                }
                                            }
                                        }
                                    };

                                    console.log('Loading source...', isSafari ? 'HLS' : 'DASH');
                                    await player.load(sourceConfig);
                                    console.log('Source loaded successfully');

                                    // Add play event listener for Safari
                                    if (isSafari) {
                                        player.on(bitmovin.player.PlayerEvent.Play, () => {
                                            console.log('Play event triggered');
                                        });
                                    }

                                    // Error handling
                                    player.on(bitmovin.player.PlayerEvent.Error, (error) => {
                                        handleError(error);
                                    });

                                } catch (error) {
                                    console.error('Setup error:', error);
                                    handleError(error);
                                }
                            }

                            function handleError(error) {
                                console.error('Player error:', error);
                                const errorDisplay = document.getElementById('error-display');
                                errorDisplay.style.display = 'block';
                                
                                let message = 'An error occurred during playback.';
                                if (error.code === 3011) {
                                    message = 'Please ensure DRM is enabled in your browser settings.';
                                } else if (error.code === 3019) {
                                    message = 'Unable to load the video. Please check your connection and try again.';
                                } else if (error.name === 'AuthenticationError') {
                                    message = 'Authentication failed. Please refresh and try again.';
                                }
                                
                                errorDisplay.textContent = message;
                            }

                            document.addEventListener('DOMContentLoaded', initPlayer);
                        </script>
                    </body>
                    </html>
                `);
            });

            return router;
        }
    };
})();

// EmbedRoutes.js
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
                const bitmovinKey = process.env.BITMOVIN_PLAYER_LICENSE_KEY;

                if (!video) {
                    return res.status(404).send("Video not found");
                }

                if (!bitmovinKey) {
                    return res.status(500).send("Bitmovin license key not configured");
                }

                res.header("Content-Security-Policy", 
                    "default-src 'self'; " +
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.bitmovin.com; " +
                    "style-src 'self' 'unsafe-inline' https://cdn.bitmovin.com; " +
                    "media-src 'self' blob: https://*.windows.net; " + 
                    "connect-src 'self' https://*.axprod.net https://*.windows.net https://cdn.bitmovin.com https://licensing.bitmovin.com; " +
                    "img-src 'self' data: blob: https://cdn.bitmovin.com;"
                );

                res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>${video.name}</title>
                        <script src="https://cdn.bitmovin.com/player/web/8/bitmovinplayer.js"></script>
                        <style>
                            body { 
                                margin: 0; 
                                padding: 0; 
                                background: #000; 
                                overflow: hidden;
                            }
                            #player-container { 
                                width: 100vw; 
                                height: 100vh; 
                                position: absolute;
                                top: 0;
                                left: 0;
                            }
                            #error-display {
                                display: none;
                                position: fixed;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                background: rgba(0, 0, 0, 0.8);
                                color: white;
                                padding: 20px;
                                border-radius: 5px;
                                font-family: Arial, sans-serif;
                                z-index: 1000;
                                text-align: center;
                            }
                        </style>
                    </head>
                    <body>
                        <div id="player-container"></div>
                        <div id="error-display"></div>
                        
                        <script>
                            async function initPlayer() {
                                const playerConfig = {
                                    key: '${bitmovinKey}',
                                    playback: {
                                        autoplay: false,
                                        muted: false
                                    },
                                    ui: {
                                        locale: 'en'
                                    },
                                    adaptation: {
                                        preload: false
                                    }
                                };

                                try {
                                    console.log('Initializing Bitmovin Player...');
                                    const container = document.getElementById('player-container');
                                    const player = new bitmovin.player.Player(container, playerConfig);

                                    console.log('Fetching license token...');
                                    const tokenResponse = await fetch('/api/authorization/${encodeURIComponent(video.name)}', {
                                        credentials: 'include'
                                    });
                                    
                                    if (!tokenResponse.ok) {
                                        throw new Error('Failed to get license token');
                                    }
                                    
                                    const token = await tokenResponse.text();
                                    console.log('Token received successfully');

                                    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                                    
                                    const sourceConfig = {
                                        dash: isSafari ? undefined : '${video.url}',
                                        hls: isSafari ? '${video.hlsUrl}' : undefined,
                                        drm: {
                                            widevine: {
                                                LA_URL: 'https://drm-widevine-licensing.axprod.net/AcquireLicense',
                                                headers: {
                                                    'X-AxDRM-Message': token
                                                }
                                            },
                                            playready: {
                                                LA_URL: 'https://drm-playready-licensing.axprod.net/AcquireLicense',
                                                headers: {
                                                    'X-AxDRM-Message': token
                                                }
                                            },
                                            fairplay: {
                                                LA_URL: 'https://drm-fairplay-licensing.axprod.net/AcquireLicense',
                                                certificateURL: 'https://8d86a98a0a9426a560f8d992.blob.core.windows.net/web/fairplay.cer',
                                                headers: {
                                                    'X-AxDRM-Message': token
                                                },
                                                prepareMessage: function(keyMessageEvent, keySession) {
                                                    return keyMessageEvent;
                                                }
                                            }
                                        }
                                    };

                                    console.log('Loading source...', isSafari ? 'HLS' : 'DASH');
                                    await player.load(sourceConfig);
                                    console.log('Source loaded successfully');

                                    player.on(bitmovin.player.PlayerEvent.Error, (error) => {
                                        handleError(error);
                                    });

                                } catch (error) {
                                    console.error('Setup error:', error);
                                    handleError(error);
                                }
                            }

                            function handleError(error) {
                                console.error('Player error:', error);
                                const errorDisplay = document.getElementById('error-display');
                                errorDisplay.style.display = 'block';
                                
                                let message = 'An error occurred during playback.';
                                if (error.code === 3011) {
                                    message = 'Please ensure DRM is enabled in your browser settings.';
                                } else if (error.code === 3019) {
                                    message = 'Unable to load the video. Please check your connection and try again.';
                                } else if (error.name === 'AuthenticationError') {
                                    message = 'Authentication failed. Please refresh and try again.';
                                }
                                
                                errorDisplay.textContent = message;
                            }

                            document.addEventListener('DOMContentLoaded', initPlayer);
                        </script>
                    </body>
                    </html>
                `);
            });

            return router;
        }
    };
})();
