(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/manager/public/vipMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a5f9aDgh95LPp9Y2GShAQaU', 'vipMgr', __filename);
// manager/public/vipMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
var userMgr_1 = require("./userMgr");
var effectMgr_1 = require("./effectMgr");
var boxMgr_1 = require("./boxMgr");
var userMgr = userMgr_1.default.getInstance();
var VipMgr = /** @class */ (function (_super) {
    __extends(VipMgr, _super);
    function VipMgr() {
        var _this = _super.call(this) || this;
        //vip模块
        _this.isInit = false;
        _this.vipTabal = null;
        _this.vip = [];
        //玩家vip信息
        _this.vipScore = null;
        _this.vipLv = null;
        _this.vipGiftInfo = [];
        _this.vipWeekPrizeInfo = [];
        //周宝箱
        _this.dictItemInfo = [];
        //购买宝箱
        _this.vipGift = [];
        _this.routes = {
            'plaza.vip.reqVipInfo': _this.reqVipInfo,
            'plaza.vip.recVipWeekPrize': _this.recVipWeekPrize,
            'plaza.vip.buyVipGift': _this.buyVipGift,
        };
        return _this;
    }
    //发包和接包
    VipMgr.prototype.testGm1 = function () {
        var route = 'plaza.box.gm';
        var msg = {
            oprType: 5,
            vipScore: 77777,
        };
        this.send_msg(route, msg);
    };
    VipMgr.prototype.sendReqVipInfo = function () {
        var route = 'plaza.vip.reqVipInfo';
        this.send_msg(route);
        //this.testGm1();
    };
    VipMgr.prototype.reqVipInfo = function (msg) {
        this.isInit = true;
        var vipInfo = msg.getDataByType(dataids_1.dataids.ID_GET_VIPINFO);
        console.log("--------vip信息-------", vipInfo);
        this.vipScore = vipInfo.vipScore;
        this.vipLv = vipInfo.vipLv;
        this.vipGiftInfo = vipInfo.vipGiftInfo;
        this.vipWeekPrizeInfo = vipInfo.vipWeekPrizeInfo;
    };
    //周宝箱
    VipMgr.prototype.sendRecVipWeekPrize = function (level) {
        var route = 'plaza.vip.recVipWeekPrize';
        var msg = {
            recVipLv: level,
        };
        this.send_msg(route, msg);
    };
    VipMgr.prototype.recVipWeekPrize = function (msg) {
        var vipWeekPrize = msg.getDataByType(dataids_1.dataids.ID_GET_WEEKVIPPRIZE);
        console.log("--------vip周宝箱信息-------", vipWeekPrize);
        this.dictItemInfo = vipWeekPrize.dictItemInfo;
        this.vipWeekPrizeInfo = vipWeekPrize.vipWeekPrizeInfo;
        this.dictItemInfo = [];
        for (var key in vipWeekPrize.dictItemInfo) {
            this.dictItemInfo.push({
                type: key,
                amount: vipWeekPrize.dictItemInfo[key]
            });
        }
        this.dictItemInfo;
    };
    VipMgr.prototype.sendBuyVipGift = function (level) {
        var route = 'plaza.vip.buyVipGift';
        var msg = {
            buyVipLv: level,
        };
        this.send_msg(route, msg);
    };
    VipMgr.prototype.buyVipGift = function (msg) {
        var VipGift = msg.getDataByType(dataids_1.dataids.ID_GET_BUYVIPGIFT);
        console.log("--------vip购买宝箱信息-------", VipGift);
        this.vipGift = [];
        this.vipGiftInfo = VipGift.vipGiftInfo;
        for (var key in VipGift.dictItemInfo) {
            for (var i = 0; i < VipGift.dictItemInfo[key].length; i++) {
                var amount = VipGift.dictItemInfo[key][i].amount;
                switch (key) {
                    case "4":
                        effectMgr_1.default.getInstance().addEffect(VipGift.dictItemInfo[key][i]);
                        break;
                    case "5":
                        boxMgr_1.default.getInstance().addBox(VipGift.dictItemInfo[key][i]);
                        break;
                    default:
                        break;
                }
                this.vipGift.push({
                    type: key,
                    amount: amount,
                });
            }
        }
    };
    //发包和接包结束
    VipMgr.prototype.initData = function () {
        //查表
        this.vipTabal = this.getConfigSync("vip_vip").json;
        cc.log("----VIP表格----", this.vipTabal);
        this.initVip();
    };
    VipMgr.prototype.initVip = function () {
        for (var i = 0; i < this.vipTabal.length; i++) {
            this.vip.push(this.vipTabal[i]);
        }
    };
    VipMgr.getInstance = function () {
        if (VipMgr._instance == null) {
            VipMgr._instance = new VipMgr();
        }
        return VipMgr._instance;
    };
    // 单例处理
    VipMgr._instance = null;
    return VipMgr;
}(BaseMgr_1.default));
exports.default = VipMgr;
/*
请求vip界面信息协议：plaza.vip.reqVipInfo
服务端需要数据：
{
    
}
服务端返回数据：
[75, dictInfo]/ip界面信息
dictInfo = {
        vipLv : null,//当前vip等级
        vipScore : null,//当前vip积分
        vipGiftInfo : {vip等级1:1, vip等级2:0},//0是未购买，1是已经购买
        vipWeekPrizeInfo : {vip等级1：时间戳，vip等级2:时间戳}//是否领取了周礼包
    }

==========================
购买vip特权宝箱协议：plaza.vip.buyVipGift
服务端需要数据：
{
    buyVipLv ： 1购买什么等级的vip礼包
}
服务端返回数据：
[77, dictPrize]//  获取的物品信息
dictPrize = {
    type : []//可能是金币数值，或者列表物品，看具体情况
}

==========================
充值vip金额协议：plaza.vip.addVipScore
服务端需要数据：
{
    addScore : 1//增加的vip积分数额
}
服务端返回数据：
[75, dictInfo]/ip界面信息
dictInfo = {
        vipLv : null,//当前vip等级
        vipScore : null,//当前vip积分
        vipGiftInfo : {vip等级1:1, vip等级2:0},//0是未购买，1是已经购买
        vipWeekPrizeInfo : {vip等级1：时间戳，vip等级2:时间戳}//是否领取了周礼包
    }

==========================
领取vip周宝箱协议：plaza.vip.recVipWeekPrize
服务端需要数据：
{
    recVipLv：1领取哪个等级的vip周福利
}
服务端返回数据：
[78, dictPrize]//  获取的物品信息
dictPrize = {
    type : []//可能是金币数值，或者列表物品，看具体情况
}
 */ 

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
        //# sourceMappingURL=vipMgr.js.map
        