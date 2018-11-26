(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/manager/public/matchMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8bfacLMSf5H6rQzn4M2ArIJ', 'matchMgr', __filename);
// manager/public/matchMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var MatchMgr = /** @class */ (function (_super) {
    __extends(MatchMgr, _super);
    function MatchMgr() {
        var _this = _super.call(this) || this;
        _this.routes = {
            'match.match.match': _this._match,
            'match.match.stopMatch': _this._stopMatch
        };
        return _this;
    }
    // 网络消息回调
    MatchMgr.prototype._match = function (msg) {
    };
    MatchMgr.prototype._stopMatch = function (msg) {
    };
    // end
    MatchMgr.prototype.sendMatch = function () {
        this.send_msg('match.match.match');
    };
    MatchMgr.prototype.sendStopMatch = function () {
        this.send_msg('match.match.stopMatch');
    };
    MatchMgr.getInstance = function () {
        if (MatchMgr._instance == null) {
            MatchMgr._instance = new MatchMgr();
        }
        return MatchMgr._instance;
    };
    MatchMgr._instance = null;
    return MatchMgr;
}(BaseMgr_1.default));
exports.default = MatchMgr;

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
        //# sourceMappingURL=matchMgr.js.map
        