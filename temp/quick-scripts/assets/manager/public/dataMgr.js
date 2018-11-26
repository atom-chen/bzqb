(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/manager/public/dataMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '592b0X0TaBD4oGg9wuVgpWT', 'dataMgr', __filename);
// manager/public/dataMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
var userMgr_1 = require("./userMgr");
var effectMgr_1 = require("./effectMgr");
var roleMgr_1 = require("./roleMgr");
var DataMgr = /** @class */ (function (_super) {
    __extends(DataMgr, _super);
    function DataMgr() {
        var _this = _super.call(this) || this;
        _this._idArr = [
            dataids_1.dataids.ID_USER_MONEYGOLD,
            dataids_1.dataids.ID_USER_MONEYSTONE,
            dataids_1.dataids.ID_USER_MONEYFEN,
            dataids_1.dataids.ID_USRE_LEVEL,
            dataids_1.dataids.ID_USRE_EXPERIENCE,
            dataids_1.dataids.ID_GET_MONEY_GOLD,
            dataids_1.dataids.ID_GET_MAILITEMS,
            dataids_1.dataids.ID_GET_BOXPRIZE,
            dataids_1.dataids.ID_GET_WEEKVIPPRIZE,
            dataids_1.dataids.ID_DOSIGNIN_RECINFO,
            dataids_1.dataids.ID_MULTISIGNIN_RECINFO,
            dataids_1.dataids.ID_GET_ALLTYPE_ITEMS,
        ];
        return _this;
    }
    DataMgr.getInstance = function () {
        if (DataMgr._instance == null) {
            DataMgr._instance = new DataMgr();
        }
        return DataMgr._instance;
    };
    DataMgr.prototype.dealResp = function (route, msg) {
        for (var i = 0; i < this._idArr.length; ++i) {
            var id = this._idArr[i], data = msg.getDataByType(id);
            if (data != null)
                userMgr_1.default.getInstance().refreshData(id, data); //刷新玩家数据
            if (id == dataids_1.dataids.ID_GET_MAILITEMS && data != null) { //邮件奖励领取
                effectMgr_1.default.getInstance().refreshData(data.dictPrize);
                roleMgr_1.default.getInstance().refreshData(data.dictPrize);
            }
            if (id == dataids_1.dataids.ID_GET_BOXPRIZE && data != null) {
                for (var i_1 = 0; i_1 < data.length; i_1++) {
                    userMgr_1.default.getInstance().refreshData(id, data[i_1]);
                    effectMgr_1.default.getInstance().addEffect(data[i_1].listTejis);
                }
            }
            if (id == dataids_1.dataids.ID_GET_ALLTYPE_ITEMS && data != null) {
                userMgr_1.default.getInstance().getAllTypeItem(data);
                console.log(effectMgr_1.default.getInstance().isInit);
                if (effectMgr_1.default.getInstance().isInit) {
                    effectMgr_1.default.getInstance().getAllTypeItem(data);
                }
            }
        }
    };
    DataMgr._instance = null;
    return DataMgr;
}(BaseMgr_1.default));
exports.default = DataMgr;

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
        //# sourceMappingURL=dataMgr.js.map
        