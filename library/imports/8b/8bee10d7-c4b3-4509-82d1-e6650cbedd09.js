"use strict";
cc._RF.push(module, '8bee1DXxLNFCYLR5mUMvt0J', 'unsettledMgr');
// manager/public/unsettledMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
var UnsettledMgr = /** @class */ (function (_super) {
    __extends(UnsettledMgr, _super);
    function UnsettledMgr() {
        var _this = _super.call(this) || this;
        _this.unsettledInfo = null;
        _this.routes = {
            'plaza.data.reqUnsettled': _this.plaza_data_reqUnsettled,
        };
        return _this;
    }
    UnsettledMgr.prototype.clearDatas = function () {
        this.unsettledInfo = null;
    };
    UnsettledMgr.prototype.getGuildInvited = function () {
        return this.unsettledInfo && this.unsettledInfo.guildInvited;
    };
    //创建公会
    UnsettledMgr.prototype.reqUnsettled = function () {
        var route = 'plaza.data.reqUnsettled';
        this.send_msg(route);
    };
    UnsettledMgr.prototype.plaza_data_reqUnsettled = function (msg) {
        console.log("plaza_data_reqUnsettled", msg);
        this.unsettledInfo = msg.getDataByType(dataids_1.dataids.ID_UNSETTLEDINFO);
    };
    UnsettledMgr.getInstance = function () {
        if (UnsettledMgr._instance == null) {
            UnsettledMgr._instance = new UnsettledMgr();
        }
        return UnsettledMgr._instance;
    };
    // 单例处理
    UnsettledMgr._instance = null;
    return UnsettledMgr;
}(BaseMgr_1.default));
exports.default = UnsettledMgr;

cc._RF.pop();