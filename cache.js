require('dotenv').config()

const cacheManager = require('cache-manager');
const fsStore = require('cache-manager-fs-hash');

const diskCache = cacheManager.caching({
    store: fsStore,
    options: {
        path: process.env.CACHE_NAME || '.cache', //path for cached files
        ttl: process.env.CACHE_TTL || 30 * 24 * 60 * 60,      //time to life in seconds
        zip: true,         //zip files to save diskspace (default: false)
    }
});

module.exports = diskCache