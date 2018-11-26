"use strict";
cc._RF.push(module, 'd7831a0F8tNZ5Xue5tx9rsn', 'compressions');
// framework/lib/jszip/compressions.js

'use strict';

exports.STORE = {
    magic: "\x00\x00",
    compress: function compress(content, compressionOptions) {
        return content; // no compression
    },
    uncompress: function uncompress(content) {
        return content; // no compression
    },
    compressInputType: null,
    uncompressInputType: null
};
exports.DEFLATE = require('./flate');

cc._RF.pop();