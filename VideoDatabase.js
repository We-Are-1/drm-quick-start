(function () {
    "use strict";

    let allVideos = [
        {
            "name": "1. giam stress CEO",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/XGkXGz5YuAaQTqURjwdRKD/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/XGkXGz5YuAaQTqURjwdRKD/cmaf/manifest.m3u8",
            "keys": [
                {
                    "keyId": "d7a83c00-6d4b-4054-9223-6e49ae4f63d7"
                }
            ]
        },
        {
            "name": "2. benh tat khong gian khac",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/QYT7UR49LRjhLgY6zDorPL/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/QYT7UR49LRjhLgY6zDorPL/cmaf/manifest.m3u8",
            "keys": [
                {
                    "keyId": "30a83508-7548-44fd-91ae-2c84919b8cd6"
                }
            ]
        }
    ];

    // Verifies that all critical information is present on a video.
    function verifyVideoIntegrity(video) {
        if (!video)
            throw new Error("A video was expected but was not present.");
        if (!video.name || !video.name.length)
            throw new Error("A video is missing its name.");

        console.log("Verifying integrity of video definition: " + video.name);

        if (!video.url || !video.url.length)
            throw new Error("The video is missing its URL.");

        // Either a hardcoded license token or the keys structure must exist. Not both.
        if (video.licenseToken && video.keys)
            throw new Error("The video has both a hardcoded license token and a content key list - pick only one.");
        if (!video.licenseToken && !video.keys)
            throw new Error("The video is missing the content key list.");

        if (video.keys) {
            if (!video.keys.length)
                throw new Error("The content key list for this video is empty.");

            // Verify that each item in the keys list has all the required data.
            video.keys.forEach(function verifyKey(item) {
                if (!item.keyId)
                    throw new Error("A content key is missing the key ID.");
            });
        }
    }

    // Verify all videos on startup.
    allVideos.forEach(verifyVideoIntegrity);

    module.exports = {
        "getAllVideos": function getAllVideos() {
            return allVideos;
        },
        "getVideoByName": function getVideoByName(name) {
            return allVideos.find(function filter(item) {
                return item.name === name;
            });
        }
    };
})();
