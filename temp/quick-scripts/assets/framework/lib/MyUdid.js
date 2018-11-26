(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/lib/MyUdid.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '945a0MwATVJ2LlY5bvmVeEO', 'MyUdid', __filename);
// framework/lib/MyUdid.ts

Object.defineProperty(exports, "__esModule", { value: true });
function MyUdid() {
    var key = "wmqpkey";
    var udid = cc.sys.localStorage.getItem(key);
    if (udid == null || udid == "") {
        var t = new Date;
        udid = guid() + t.getTime();
        cc.sys.localStorage.setItem(key, udid);
    }
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    function guid() {
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
    return udid;
}
exports.default = MyUdid;

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
        //# sourceMappingURL=MyUdid.js.map
        