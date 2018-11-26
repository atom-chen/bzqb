(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/manager/public/boxMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '99d85NRjWNEiICulGh7cqsZ', 'boxMgr', __filename);
// manager/public/boxMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
var userMgr_1 = require("./userMgr");
var enums_1 = require("../enums");
var effectMgr_1 = require("./effectMgr");
var ModuleMgr_1 = require("../../framework/modules/ModuleMgr");
var userMgr = userMgr_1.default.getInstance();
var BoxMgr = /** @class */ (function (_super) {
    __extends(BoxMgr, _super);
    function BoxMgr() {
        var _this = _super.call(this) || this;
        _this.boxTable = null; //宝箱表格
        _this.levelBoxTable = null; //等级宝箱表格
        _this.levelBoxInfo = null; //等级宝箱数据
        _this.battleBox = []; //战斗宝箱
        _this.curBattleBox = null; //当前战斗宝箱
        _this.routes = {
            'plaza.data.reqBoxes': _this.plaza_data_reqBoxes,
            'plaza.box.reqLevelBox': _this.reqLevelBox,
            'plaza.box.unlockBox': _this.plaza_box_unlockBox,
            'plaza.box.openBox': _this.plaza_box_openBox,
            'plaza.box.buyLevelBox': _this.buyLevelBox,
        };
        return _this;
    }
    BoxMgr.prototype.plaza_data_reqBoxes = function (msg) {
        var BoxInfo = msg.getDataByType(dataids_1.dataids.ID_BOXLIST);
        console.log("--------宝箱数据-------", BoxInfo);
        //查表
        this.boxTable = this.getConfigSync("baoxiang_baoxiang").json;
        this.initData(BoxInfo);
    };
    BoxMgr.prototype.sendReqLevelBox = function () {
        console.log("请求等级宝箱");
        var route = 'plaza.box.reqLevelBox';
        this.send_msg(route);
    };
    BoxMgr.prototype.reqLevelBox = function (msg) {
        this.levelBoxInfo = msg.getDataByType(dataids_1.dataids.ID_GET_LEVELBOX);
        console.log("--------等级宝箱数据-------", this.levelBoxInfo);
        this.levelBoxTable = this.getConfigSync("LevelBox_LevelBox").json;
    };
    BoxMgr.prototype.sendBuyLevelBox = function (level) {
        console.log("请求购买等级宝箱");
        var route = 'plaza.box.buyLevelBox';
        this.send_msg(route, { buyLv: level });
    };
    BoxMgr.prototype.buyLevelBox = function (msg) {
        var diamond = msg.getDataByType(dataids_1.dataids.ID_USER_MONEYSTONE);
        var rewardInfo = msg.getDataByType(dataids_1.dataids.ID_GET_ALLTYPE_ITEMS);
        console.log("--------购买等级宝箱-------", diamond, rewardInfo);
        ModuleMgr_1.default.getInstance().showHandleGainBox(rewardInfo);
    };
    BoxMgr.prototype.plaza_box_unlockBox = function (msg) {
        var battleBoxInfo = msg.getDataByType(dataids_1.dataids.ID_UNLOCKBOX);
        console.log("--------开始解锁战斗宝箱-------", battleBoxInfo);
        for (var i = 0; i < this.battleBox.length; i++) {
            if (battleBoxInfo.id == this.battleBox[i].id_service) {
                this.battleBox[i].unlockTime = battleBoxInfo.unlockTime;
                break;
            }
        }
    };
    BoxMgr.prototype.plaza_box_openBox = function (msg) {
        cc.log(msg);
        var id = msg.getDataByType(dataids_1.dataids.ID_OPR_BOXID).id;
        var getMoney = msg.getDataByType(dataids_1.dataids.ID_GET_MONEY_GOLD).moneyGold;
        var card = msg.getDataByType(dataids_1.dataids.ID_PRIZE_LIST_TEJI);
        var newBox = msg.getDataByType(dataids_1.dataids.ID_GET_BOX);
        userMgr.onlineBoxTimes = msg.getDataByType(dataids_1.dataids.ID_OPEN_TIMES).todayBoxShareTimes;
        console.log("--------打开宝箱-------", id, getMoney, card, newBox, this.onlineBox.boxTimes);
        this.deleteBox(id);
        this.addBox(newBox);
        if (effectMgr_1.default.getInstance().isInit) {
            effectMgr_1.default.getInstance().addEffect(card);
        }
        var amount = 0;
        for (var i = 0; i < card.length; i++) {
            amount += card[i].amount;
        }
        this.boxReward = [{ type: enums_1.enums.Get_Gold, amount: getMoney }, { type: enums_1.enums.Get_Skill, amount: amount }];
    };
    //删除宝箱
    BoxMgr.prototype.deleteBox = function (id) {
        console.log("--------删除宝箱-------", id);
        if (this.onlineBox.id_service == id) {
            this.onlineBox = null;
        }
        else if (this.winBox.id_service == id) {
            this.winBox = null;
        }
        else {
            for (var i = 0; i < this.battleBox.length; i++) {
                if (this.battleBox[i].id_service == id) {
                    this.battleBox.splice(i, i);
                    return;
                }
            }
        }
    };
    //更新宝箱
    BoxMgr.prototype.addBox = function (boxData) {
        console.log("--------增加宝箱-------", boxData);
        var box = this.selectBox(boxData.itemId);
        var obj = {
            id_service: boxData.id,
            unlockTime: boxData.unlockTime,
            boxInfo: box,
        };
        if (box.boxtype == 1) {
            obj.boxTimes = userMgr.onlineBoxTimes;
            this.onlineBox = obj;
        }
        else if (box.boxtype == 2) {
            obj.boxTimes = userMgr.winBoxTimes;
            this.winBox = obj;
        }
        else if (box.boxtype > 3 && box.boxtype < 7) {
            this.battleBox.push(obj);
        }
    };
    BoxMgr.prototype.initData = function (data) {
        for (var i = 0; i < data.length; i++) {
            this.addBox(data[i]);
        }
        cc.log("----战斗宝箱----", this.battleBox);
        cc.log("----在线宝箱----", this.onlineBox);
        cc.log("----胜利宝箱----", this.winBox);
        //this.testGm2();
    };
    BoxMgr.prototype.openBox = function (id) {
        var route = 'plaza.box.openBox';
        var msg = {
            'id': id,
        };
        this.send_msg(route, msg);
    };
    BoxMgr.prototype.testGm1 = function () {
        var route = 'plaza.box.gm';
        var msg = {
            oprType: 3,
            //解锁加速
            boxId: 50,
            reduceTime: 100000,
        };
        this.send_msg(route, msg);
    };
    BoxMgr.prototype.testGm2 = function () {
        var route = 'plaza.box.gm';
        var msg = {
            oprType: 4,
            //解锁加速
            attrName: 'moneyFen',
            attrValue: 10000,
        };
        this.send_msg(route, msg);
    };
    BoxMgr.prototype.unlockBox = function () {
        this.closeModule("battleBox");
        var route = 'plaza.box.unlockBox';
        var msg = {
            'id': this.curBattleBox.id_service,
        };
        this.send_msg(route, msg);
    };
    BoxMgr.prototype.selectBox = function (id) {
        for (var i = 0; i < this.boxTable.length; i++) {
            var box = this.boxTable[i];
            if (box.id == id) {
                return box;
            }
        }
        return console.log("没有该宝箱id");
    };
    BoxMgr.prototype.setCurBattleBox = function (index) {
        this.curBattleBox = this.battleBox[index];
    };
    BoxMgr.getInstance = function () {
        if (BoxMgr._instance == null) {
            BoxMgr._instance = new BoxMgr();
        }
        return BoxMgr._instance;
    };
    // 单例处理
    BoxMgr._instance = null;
    return BoxMgr;
}(BaseMgr_1.default));
exports.default = BoxMgr;

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
        //# sourceMappingURL=boxMgr.js.map
        