(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/manager/public/signInMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '13313RCDjlJXJPqy45fmu2X', 'signInMgr', __filename);
// manager/public/signInMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
var enums_1 = require("../enums");
/*
author: 陈斌杰
日期:2018-11-21 10:44:38
*/
var SignInMgr = /** @class */ (function (_super) {
    __extends(SignInMgr, _super);
    function SignInMgr() {
        var _this = _super.call(this) || this;
        _this.isFrist = false; //是否第一次请求数据
        _this.signInCfgTab = null; //签到配表
        _this.signIn_totalRewarkCfgTab = null; //累积签到宝箱配表
        _this.signInData = {}; //签到所有数据
        _this.totalBoxesData = {}; //累积宝箱数据
        _this.multiDay = 0; //累积签到天数
        _this.signIn_Reissues = enums_1.enums.SignIn_Reissues; //每月补签次数
        _this.signIn_ReissuesCost = enums_1.enums.SignIn_ReissuesCost; //每月补签费用
        _this.routes = {
            "plaza.signin.reqSigninInfo": _this.reqSigninInfo,
            "plaza.signin.signin": _this.signin,
            "plaza.signin.repairSignin": _this.repairSignin,
            "plaza.signin.recMultiSignin": _this.recMultiSignin,
        };
        return _this;
    }
    SignInMgr.getInstance = function () {
        if (SignInMgr._instance == null) {
            SignInMgr._instance = new SignInMgr();
        }
        return SignInMgr._instance;
    };
    //向服务器请求签到信息数据
    SignInMgr.prototype.sendReqSignInInfo = function () {
        this.send_msg("plaza.signin.reqSigninInfo");
    };
    //获取服务器下发的签到信息
    SignInMgr.prototype.reqSigninInfo = function (msg) {
        this.isFrist = true;
        var data = msg.getDataByType(dataids_1.dataids.ID_GET_SIGNIN_INFO);
        this.getSignInCfgTab();
        this.initSignInData();
        this.initTotalBoxesData();
        this.setSignInData(data.listSignin);
        this.setTotalBoxesData(data.listMultiSignin);
        this.signIn_Reissues -= data.repairTimes; //data.repairTimes 当前签到的次数
    };
    //向服务器请求签到数据
    SignInMgr.prototype.sendReqSignIn = function () {
        this.send_msg("plaza.signin.signin");
    };
    //获取服务器下发的签到数据
    SignInMgr.prototype.signin = function (msg) {
        this.isFrist = true;
        var data = msg.getDataByType(dataids_1.dataids.ID_DOSIGNIN_RECINFO);
        this.setNowSignInData(data.dayIndex);
        this.multiDay++;
    };
    //向服务器发送补签请求
    SignInMgr.prototype.sendReqRepairSignIn = function (dayIndex) {
        var msg = {
            dayIndex: dayIndex,
        };
        this.send_msg("plaza.signin.repairSignin", msg);
    };
    //获取服务器下发的补签数据
    SignInMgr.prototype.repairSignin = function (msg) {
        var data = msg.getDataByType(dataids_1.dataids.ID_DOSIGNIN_RECINFO);
        this.setNowSignInData(data.dayIndex);
        this.signIn_Reissues--;
        this.multiDay++;
    };
    //向服务器发送累积签到宝箱请求
    SignInMgr.prototype.sendReqMultiSignIn = function (dayIndex) {
        var msg = {
            multiDayIndex: dayIndex,
        };
        this.send_msg("plaza.signin.recMultiSignin", msg);
    };
    //获取服务器下发的累积签到宝箱数据
    SignInMgr.prototype.recMultiSignin = function (msg) {
        var data = msg.getDataByType(dataids_1.dataids.ID_MULTISIGNIN_RECINFO);
        this.setNowBoxesData(data.multiDayIndex);
    };
    //获取签到配表
    SignInMgr.prototype.getSignInCfgTab = function () {
        this.signInCfgTab = this.getConfigSync("signIn").json;
        this.signIn_totalRewarkCfgTab = this.getConfigSync("signIn_totalRewark").json;
    };
    //初始化全部签到数据
    SignInMgr.prototype.initSignInData = function () {
        this.signInData.list = [];
        for (var i = 0; i < this.signInCfgTab.length; i++) {
            var cfgData = this.signInCfgTab[i];
            var signIn_1 = {};
            signIn_1.rewark = {};
            signIn_1.rewark.type = cfgData.reward.type;
            signIn_1.rewark.itemId = cfgData.reward.itemId;
            signIn_1.rewark.amount = cfgData.reward.amount;
            signIn_1.isSignIn = false;
            signIn_1.signInDay = cfgData.day;
            signIn_1.again_signIn = false;
            signIn_1.vipLv = cfgData.vip_Level;
            this.signInData.list.push(signIn_1);
        }
    };
    //初始化累积签到宝箱数据
    SignInMgr.prototype.initTotalBoxesData = function () {
        this.totalBoxesData.list = [];
        for (var i = 0; i < this.signIn_totalRewarkCfgTab.length; i++) {
            var totalBoxesData = this.signIn_totalRewarkCfgTab[i];
            var boxes = {};
            boxes.isOpen = false;
            boxes.totalSignInDay = totalBoxesData.total_Days;
            boxes.rewarkList = [];
            for (var j = 0; j < totalBoxesData.total_reward.length; j++) {
                var rewarkData = totalBoxesData.total_reward[j];
                var rewark = {};
                rewark.type = rewarkData.type;
                rewark.itemId = rewarkData.itemId;
                rewark.amount = rewarkData.amount;
                boxes.rewarkList.push(rewark);
            }
            this.totalBoxesData.list.push(boxes);
        }
    };
    //设置全部签到数据
    SignInMgr.prototype.setSignInData = function (data) {
        var nowDay = new Date().getDate();
        if (data == null || data.length == 0) { //第一次进入签到一次都没签到过
            for (var i = 0; i < this.signInData.list.length; i++) {
                var signIn_2 = this.signInData.list[i];
                if (signIn_2.signInDay < nowDay) {
                    signIn_2.again_signIn = true;
                }
            }
            return;
        }
        for (var i = 0; i < this.signInData.list.length; i++) {
            var signIn_3 = this.signInData.list[i];
            for (var j = 0; j < data.length; j++) {
                if (signIn_3.signInDay == data[j]) {
                    signIn_3.isSignIn = true;
                    signIn_3.again_signIn = false;
                    this.multiDay++;
                    break;
                }
            }
            if (!signIn_3.isSignIn && signIn_3.signInDay < nowDay) {
                signIn_3.again_signIn = true;
            }
        }
    };
    //设置累积宝箱领取数据
    SignInMgr.prototype.setTotalBoxesData = function (data) {
        if (data == null || data.length == 0) {
            return;
        }
        for (var i = 0; i < this.totalBoxesData.list.length; i++) {
            var boxData = this.totalBoxesData.list[i];
            for (var j = 0; j < data.length; j++) {
                if (boxData.totalSignInDay == data[j]) {
                    boxData.isOpen = true;
                    break;
                }
            }
        }
    };
    //设置当前签到的数据
    SignInMgr.prototype.setNowSignInData = function (day) {
        this.signInData.list[day - 1].isSignIn = true;
    };
    //设置当前累积宝箱的数据
    SignInMgr.prototype.setNowBoxesData = function (day) {
        for (var i = 0; i < this.totalBoxesData.list.length; i++) {
            var boxesData = this.totalBoxesData.list[i];
            if (boxesData.totalSignInDay == day) {
                boxesData.isOpen = true;
                break;
            }
        }
    };
    //是否可以签到判断
    SignInMgr.prototype.getIsCanSignIn = function (day) {
        var nowTime = new Date();
        var nowDay = nowTime.getDate();
        if (day == nowDay) {
            return true;
        }
        return false;
    };
    //判断是否可以补签
    SignInMgr.prototype.getIsCanShowRepairSignIn = function (dayIndex) {
        var isCanRepair = true;
        for (var i = 0; i < this.signInData.list.length; i++) {
            var signInData = this.signInData.list[i];
            if (signInData.signInDay < dayIndex) {
                if (signInData.again_signIn) {
                    isCanRepair = false;
                    break;
                }
                else {
                    continue;
                }
            }
            else {
                break;
            }
        }
        return isCanRepair;
    };
    //判断是否可以打开
    SignInMgr.prototype.getIsCanOpenBoxes = function (dayIndex) {
        var isCanOpen = false;
        for (var i = 0; i < this.totalBoxesData.list.length; i++) {
            var boxData = this.totalBoxesData.list[i];
            if (boxData.totalSignInDay == dayIndex && boxData.totalSignInDay <= this.multiDay) {
                isCanOpen = true;
                break;
            }
        }
        return isCanOpen;
    };
    // 单例处理
    SignInMgr._instance = null;
    return SignInMgr;
}(BaseMgr_1.default));
exports.default = SignInMgr;

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
        //# sourceMappingURL=signInMgr.js.map
        