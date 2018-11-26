(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/lib/jszip/nodeBuffer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9b59ft37nVEg5MbeNlT3OLI', 'nodeBuffer', __filename);
// framework/lib/jszip/nodeBuffer.js

'use strict';

module.exports = function (data, encoding) {
    return new Buffer(data, encoding);
};
module.exports.test = function (b) {
    return Buffer.isBuffer(b);
};

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
        //# sourceMappingURL=nodeBuffer.js.map
        