"use strict";
cc._RF.push(module, 'd3d62Wh6f5IZZc0ljFMy6qZ', 'gmMgr');
// manager/public/gmMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var gmMgrType = {
    gm_addUserExp: 1,
    gm_addUserCoin: 2,
    gm_addFenZuan: 3,
    gm_addBox: 4,
    gm_addTeji: 5,
    gm_addEmail: 6,
    gm_addHonor: 7,
    gm_addWinBattleCount: 8,
    gm_addGoods: 9,
    gm_addYueka: 10,
    gm_addZhongShenKa: 11,
    gm_addGuildKey: 12,
    gm_changeStage: 13,
    gm_getAllTeji: 14,
    gm_getAllGoods: 15
};
var GMMgr = /** @class */ (function (_super) {
    __extends(GMMgr, _super);
    function GMMgr() {
        var _this = _super.call(this) || this;
        _this.routes = {};
        var self = _this;
        cc.loader.loadRes("/config/clientgm_gm.json", function (err, object) {
            if (err) {
                console.log(err);
                return;
            }
            self.data = object.json;
        });
        return _this;
    }
    GMMgr.getInstance = function () {
        if (GMMgr._instance == null) {
            GMMgr._instance = new GMMgr();
        }
        return GMMgr._instance;
    };
    GMMgr.prototype.sendData = function (id, param1, param2) {
        var route = "plaza.gm.clientGm";
        var msg = {
            gmId: 0,
            param1: 0,
            param2: 0
        };
        if (gmMgrType.gm_addEmail != id) {
            msg.gmId = parseInt(id);
            msg.param1 = parseInt(param1);
            msg.param2 = parseInt(param2);
        }
        else {
            msg.gmId = parseInt(id);
            msg.param1 = param1;
            var data = JSON.parse(param2);
            msg.param2 = data;
        }
        this.send_msg(route, msg);
    };
    // 单例处理
    GMMgr._instance = null;
    return GMMgr;
}(BaseMgr_1.default));
exports.default = GMMgr;

cc._RF.pop();