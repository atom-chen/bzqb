"use strict";
cc._RF.push(module, '8bfacLMSf5H6rQzn4M2ArIJ', 'matchMgr');
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