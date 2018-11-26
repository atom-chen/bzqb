(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/manager/public/cardMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fa6254E+6JIMLOZ60Ssf43W', 'cardMgr', __filename);
// manager/public/cardMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
var effectMgr_1 = require("./effectMgr");
var enums_1 = require("../enums");
var cardMgr = /** @class */ (function (_super) {
    __extends(cardMgr, _super);
    function cardMgr() {
        var _this = _super.call(this) || this;
        _this.monthlyCardTime = 2592000000; //月卡时间(毫秒)
        _this.monthlyIsInit = false;
        _this.LifeIsInit = false;
        _this.monthlyCardInfo = null;
        _this.lifetimeCardInfo = null;
        _this.monthlyCardBox = []; //月卡奖励
        _this.routes = {
            "plaza.privilege.reqMonthlyCardInfo": _this.reqMonthlyCardInfo,
            "plaza.privilege.reqLifetimeCardInfo": _this.reqLifetimeCardInfo,
            "plaza.privilege.buyMonthlyCard": _this.buyMonthlyCard,
            "plaza.privilege.buyLifetimeCard": _this.buyLifetimeCard,
            "plaza.privilege.recMonthlyDailyBox": _this.recMonthlyDailyBox,
        };
        return _this;
    }
    cardMgr.prototype.sendReqMonthlyCardInfo = function () {
        var route = 'plaza.privilege.reqMonthlyCardInfo';
        this.send_msg(route);
    };
    cardMgr.prototype.reqMonthlyCardInfo = function (msg) {
        this.monthlyIsInit = true;
        this.monthlyCardInfo = msg.getDataByType(dataids_1.dataids.ID_MONTHLYCARD_INFO);
        console.log("--------月卡信息-------", this.monthlyCardInfo);
    };
    cardMgr.prototype.sendReqLifetimeCardInfo = function () {
        var route = 'plaza.privilege.reqLifetimeCardInfo';
        this.send_msg(route);
    };
    cardMgr.prototype.reqLifetimeCardInfo = function (msg) {
        this.LifeIsInit = true;
        this.lifetimeCardInfo = msg.getDataByType(dataids_1.dataids.ID_LIFETIMECARD_INFO);
        console.log("--------终身卡信息-------", this.lifetimeCardInfo);
    };
    cardMgr.prototype.sendBuyMonthlyCard = function () {
        var route = 'plaza.privilege.buyMonthlyCard';
        this.send_msg(route);
    };
    cardMgr.prototype.buyMonthlyCard = function (msg) {
        this.monthlyCardInfo = msg.getDataByType(dataids_1.dataids.ID_MONTHLYCARD_INFO);
        console.log("--------购买月卡-------", this.monthlyCardInfo);
    };
    cardMgr.prototype.sendBuyLifetimeCard = function () {
        var route = 'plaza.privilege.buyLifetimeCard';
        this.send_msg(route);
    };
    cardMgr.prototype.buyLifetimeCard = function (msg) {
        this.lifetimeCardInfo = msg.getDataByType(dataids_1.dataids.ID_LIFETIMECARD_INFO);
        console.log("--------购买终身卡-------", this.lifetimeCardInfo);
    };
    cardMgr.prototype.sendRecMonthlyDailyBox = function () {
        var route = 'plaza.privilege.recMonthlyDailyBox';
        this.send_msg(route);
    };
    cardMgr.prototype.recMonthlyDailyBox = function (msg) {
        this.monthlyCardInfo.isOpenBox = msg.getDataByType(dataids_1.dataids.ID_MONTHLYCARD_BOXPRIZE);
        var goldInfo = msg.getDataByType(dataids_1.dataids.ID_GET_MONEY_GOLD);
        var effectInfo = msg.getDataByType(dataids_1.dataids.ID_PRIZE_LIST_TEJI);
        console.log("--------领取月卡宝箱-------", this.monthlyCardInfo, goldInfo, effectInfo);
        if (effectMgr_1.default.getInstance().isInit) {
            effectMgr_1.default.getInstance().addEffect(effectInfo);
        }
        this.monthlyCardBox = [];
        this.monthlyCardBox.push({
            type: enums_1.enums.Get_Gold,
            amount: goldInfo,
        });
        for (var i = 0; i < effectInfo.length; i++) {
            this.monthlyCardBox.push({
                type: effectInfo[i].type,
                amount: effectInfo[i].amount,
            });
        }
    };
    cardMgr.getInstance = function () {
        if (cardMgr._instance == null) {
            cardMgr._instance = new cardMgr();
        }
        return cardMgr._instance;
    };
    // 单例处理
    cardMgr._instance = null;
    return cardMgr;
}(BaseMgr_1.default));
exports.default = cardMgr;

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
        //# sourceMappingURL=cardMgr.js.map
        