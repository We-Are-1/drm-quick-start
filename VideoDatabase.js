// update-video-db.js
require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

// Axinom API configuration
const config = {
    baseURL: 'https://api.mosaic-dev.axinom.net/catalog/v4',
    headers: {
        'X-API-Key': process.env.CATALOG_API_KEY,
        'Content-Type': 'application/json'
    }
};

// GraphQL query to get all videos with their manifests and DRM info
const GET_VIDEOS_QUERY = `
query GetVideos {
    videos(first: 100) {
        nodes {
            id
            title
            videoStreams {
                nodes {
                    dashManifestUrl
                    hlsManifestUrl
                    drmKeys {
                        nodes {
                            keyId
                        }
                    }
                }
            }
        }
    }
}`;

async function getVideosFromAxinom() {
    try {
        // Fetch videos from Axinom Catalog API using GraphQL
        const response = await axios.post(`${config.baseURL}/graphql`, {
            query: GET_VIDEOS_QUERY
        }, { headers: config.headers });

        const videos = response.data.data.videos.nodes;

        // Transform Axinom video data to our VideoDatabase format
        const transformedVideos = videos.map(video => {
            const videoStream = video.videoStreams.nodes[0]; // Get first video stream
            return {
                name: video.title,
                url: videoStream.dashManifestUrl,
                hlsUrl: videoStream.hlsManifestUrl,
                keys: videoStream.drmKeys.nodes.map(key => ({
                    keyId: key.keyId
                }))
            };
        });

        // Generate VideoDatabase.js content
        const dbContent = `(function () {
    "use strict";

    // This file is auto-generated. Do not edit manually.
    // Last updated: ${new Date().toISOString()}

    let videos = ${JSON.stringify(transformedVideos, null, 4)};

    module.exports = {
        "getAllVideos": function getAllVideos() {
            return videos;
        },

        "getVideoByName": function getVideoByName(name) {
            return videos.find(v => v.name === name);
        }
    };
})();`;

        // Write to VideoDatabase.js
        fs.writeFileSync('VideoDatabase.js', dbContent);
        console.log('Successfully updated VideoDatabase.js with', transformedVideos.length, 'videos');

        // Create a backup of the database
        const backupPath = `backups/VideoDatabase-${new Date().toISOString().replace(/:/g, '-')}.js`;
        if (!fs.existsSync('backups')) {
            fs.mkdirSync('backups');
        }
        fs.writeFileSync(backupPath, dbContent);
        console.log('Created backup at:', backupPath);

    } catch (error) {
        console.error('Error updating video database:', error);
        if (error.response) {
            console.error('API response:', error.response.data);
        }
    }
}

// Create .env template if it doesn't exist
if (!fs.existsSync('.env')) {
    const envTemplate = `# Axinom Catalog API Key
CATALOG_API_KEY=your_catalog_api_key_here

# Optional: DRM Configuration
AXINOM_COMMUNICATION_KEY_ID=your_communication_key_id
AXINOM_COMMUNICATION_KEY=your_communication_key

# Optional: Token Validity (in days)
TOKEN_VALIDITY_BEFORE=1
TOKEN_VALIDITY_AFTER=1
`;
    fs.writeFileSync('.env.template', envTemplate);
    console.log('Created .env.template - please fill in your Axinom API credentials');
}

// Create package.json if it doesn't exist
if (!fs.existsSync('package.json')) {
    const packageJson = {
        "name": "axinom-video-db-updater",
        "version": "1.0.0",
        "description": "Updates VideoDatabase.js with Axinom video catalog",
        "main": "update-video-db.js",
        "scripts": {
            "update": "node update-video-db.js"
        },
        "dependencies": {
            "axios": "^1.6.2",
            "dotenv": "^16.3.1"
        }
    };
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('Created package.json');
}

// Run the update if .env exists
if (fs.existsSync('.env')) {
    console.log('Starting video database update...');
    getVideosFromAxinom();
} else {
    console.log('Please create .env file with your Axinom API credentials');
}