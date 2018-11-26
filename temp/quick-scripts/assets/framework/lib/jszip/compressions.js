(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/lib/jszip/compressions.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd7831a0F8tNZ5Xue5tx9rsn', 'compressions', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=compressions.js.map
        