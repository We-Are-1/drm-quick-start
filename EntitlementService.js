(function () {
    "use strict";

    require('dotenv').config();
    let express = require("express");
    let videoDatabase = require("./VideoDatabase");
    let jwt = require("jsonwebtoken");
    let crypto = require("crypto");
    let uuid = require("node-uuid");
    let moment = require("moment");

    const NO_SUCH_VIDEO_STATUS_CODE = 400;
    const NEED_TO_KNOW_SECRETS_STATUS_CODE = 500;

    // Get credentials from environment variables
    const axinomCredentials = {
        communicationKeyId: process.env.AXINOM_COMMUNICATION_KEY_ID,
        communicationKey: process.env.AXINOM_COMMUNICATION_KEY
    };

    module.exports = {
        "createRouter": function createRouter() {
            let router = express.Router();

            router.get("/:videoName", function processGet(request, response) {
                response.header("Cache-Control", "no-cache");

                let video = videoDatabase.getVideoByName(request.params.videoName);

                if (!video) {
                    response.status(NO_SUCH_VIDEO_STATUS_CODE).send("No such video");
                    return;
                }

                if (video.licenseToken) {
                    response.send(video.licenseToken);  // Using send for hardcoded token
                    return;
                }

                // Check if we have credentials
                if (!axinomCredentials.communicationKeyId || !axinomCredentials.communicationKey) {
                    console.log("ERROR: Missing Axinom credentials in environment variables.");
                    response.status(NEED_TO_KNOW_SECRETS_STATUS_CODE)
                        .send("Missing Axinom credentials in environment variables.");
                    return;
                }

                let communicationKeyAsBuffer = Buffer.from(axinomCredentials.communicationKey, "base64");

                // Token validity period (configurable through env vars)
                let now = moment();
                let validFrom = now.clone().subtract(process.env.TOKEN_VALIDITY_BEFORE || 1, "days");
                let validTo = now.clone().add(process.env.TOKEN_VALIDITY_AFTER || 1, "days");

                let message = {
                    "type": "entitlement_message",
                    "version": 2,
                    "license": {
                        "duration": 3600
                    },
                    "content_keys_source": {
                        "inline": []
                    },
                    "content_key_usage_policies": [
                        {
                            "name": "Policy",
                            "widevine": {
                                "device_security_level": "HW_SECURE_DECODE",
                                "hdcp": "2.0"
                            },
                            "playready": {
                                "min_device_security_level": 2000
                            }
                        }
                    ]
                };

                video.keys.forEach(function (key) {
                    let inlineKey = {
                        "id": key.keyId,
                        "usage_policy": "Policy"        
                    } 

                    message.content_keys_source.inline.push(inlineKey);
                });

                let envelope = {
                    "version": 1,
                    "com_key_id": axinomCredentials.communicationKeyId,
                    "message": message,
                    "begin_date": validFrom.toISOString(),
                    "expiration_date": validTo.toISOString()
                };

                console.log("Creating license token with payload: " + JSON.stringify(envelope));

                let licenseToken = jwt.sign(envelope, communicationKeyAsBuffer, {
                    "algorithm": "HS256",
                    "noTimestamp": true
                });

                response.send(licenseToken);
            });

            return router;
        }
    };
})();