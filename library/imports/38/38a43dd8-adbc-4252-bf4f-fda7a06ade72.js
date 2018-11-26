"use strict";
cc._RF.push(module, '38a433YrbxCUr9P/aegat5y', 'gameMgr');
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