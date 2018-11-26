(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/manager/game/gameMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '38a433YrbxCUr9P/aegat5y', 'gameMgr', __filename);
// manager/game/gameMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var GameMgr = /** @class */ (function (_super) {
    __extends(GameMgr, _super);
    function GameMgr() {
        var _this = _super.call(this) || this;
        _this.routes = {};
        return _this;
    }
    GameMgr.getInstance = function () {
        if (GameMgr._instance == null) {
            GameMgr._instance = new GameMgr();
        }
        return GameMgr._instance;
    };
    GameMgr._instance = null;
    return GameMgr;
}(BaseMgr_1.default));
exports.default = GameMgr;

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
        //# sourceMappingURL=gameMgr.js.map
        