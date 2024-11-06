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
                        <meta charset="utf-8">
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
                        <script type="text/javascript" src="https://cdn.bitmovin.com/player/web/8/bitmovinplayer.js"></script>
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
                                try {
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
                                        },
                                        network: {
                                            preprocessHttpRequest: function(type, request) {
                                                return Promise.resolve(request);
                                            }
                                        }
                                    };

                                    const container = document.getElementById('player-container');
                                    const player = new bitmovin.player.Player(container, playerConfig);

                                    const tokenResponse = await fetch('/api/authorization/${encodeURIComponent(video.name)}', {
                                        credentials: 'include'
                                    });
                                    
                                    if (!tokenResponse.ok) {
                                        throw new Error('Failed to get license token');
                                    }
                                    
                                    const token = await tokenResponse.text();
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
                                                prepareContentId: (uri) => {
                                                    return uri.substring(uri.indexOf("skd"));
                                                },
                                                prepareLicenseAsync: ckc => {
                                                    return new Promise((resolve, reject) => {
                                                        const reader = new FileReader();
                                                        reader.addEventListener('loadend', () => resolve(new Uint8Array(reader.result)));
                                                        reader.addEventListener('error', () => reject(reader.error));
                                                        reader.readAsArrayBuffer(ckc);
                                                    });
                                                },
                                                prepareMessage: event => new Blob([event.message], {type: 'application/octet-binary'}),
                                                useUint16InitData: true,
                                                licenseResponseType: 'blob'
                                            }
                                        }
                                    };

                                    player.on('error', function(error) {
                                        handleError(error);
                                    });

                                    player.on('warning', function(warning) {
                                        console.warn('Player warning:', warning);
                                    });

                                    if (isSafari) {
                                        player.on('play', function() {
