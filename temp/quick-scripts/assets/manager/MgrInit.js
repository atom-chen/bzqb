(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/manager/MgrInit.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0d7feavboJPgY/1piPFVbdX', 'MgrInit', __filename);
// manager/MgrInit.ts

Object.defineProperty(exports, "__esModule", { value: true });
var loginMgr_1 = require("./public/loginMgr");
var userMgr_1 = require("./public/userMgr");
var dataMgr_1 = require("./public/dataMgr");
var boxMgr_1 = require("./public/boxMgr");
var effectMgr_1 = require("./public/effectMgr");
var itemMgr_1 = require("./public/itemMgr");
var tableMgr_1 = require("./public/tableMgr");
var shopMgr_1 = require("./public/shopMgr");
var roleMgr_1 = require("./public/roleMgr");
var vipMgr_1 = require("./public/vipMgr");
var achievementMgr_1 = require("./public/achievementMgr");
var friendsMgr_1 = require("./public/friendsMgr");
var unsettledMgr_1 = require("./public/unsettledMgr");
var gmMgr_1 = require("./public/gmMgr");
function MgrInit() {
    dataMgr_1.default.getInstance();
    tableMgr_1.default.getInstance();
    unsettledMgr_1.default.getInstance();
    loginMgr_1.default.getInstance();
    userMgr_1.default.getInstance();
    boxMgr_1.default.getInstance();
    itemMgr_1.default.getInstance();
    effectMgr_1.default.getInstance();
    roleMgr_1.default.getInstance();
    shopMgr_1.default.getInstance();
    vipMgr_1.default.getInstance();
    achievementMgr_1.default.getInstance();
    friendsMgr_1.default.getInstance();
    gmMgr_1.default.getInstance();
}
exports.default = MgrInit;

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
        //# sourceMappingURL=MgrInit.js.map
        