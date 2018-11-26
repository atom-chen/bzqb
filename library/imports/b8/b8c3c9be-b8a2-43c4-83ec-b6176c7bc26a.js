"use strict";
cc._RF.push(module, 'b8c3cm+uKJDxIPsthdse8Jq', 'talentMgr');
// manager/public/talentMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
var userMgr_1 = require("./userMgr");
var userMgr = userMgr_1.default.getInstance();
var talentMgr = /** @class */ (function (_super) {
    __extends(talentMgr, _super);
    function talentMgr() {
        var _this = _super.call(this) || this;
        _this.curTalent = null;
        _this.talentList = null;
        _this.isInit = false;
        _this.talentPoint = null;
        _this.lastResetTime = null;
        _this.talentInfo = null;
        _this.routes = {
            'plaza.talent.reqTalentInfo': _this.reqTalentInfo,
            'plaza.talent.resetTalent': _this.resetTalent,
            'plaza.talent.learnTalent': _this.learnTalent,
        };
        return _this;
    }
    talentMgr.prototype.initData = function () {
        this.talentList = this.getConfigSync("talent_talent").json;
        for (var i = 0; i < this.talentList.length; i++) {
            this.talentList[i].curLevel = 0;
        }
        for (var id in this.talentInfo) {
            var obj = this.selectTalent(id);
            obj.curLevel = this.talentInfo[id];
        }
        console.log(this.talentList);
    };
    talentMgr.prototype.selectTalent = function (id) {
        for (var i = 0; i < this.talentList.length; i++) {
            var achievement = this.talentList[i];
            if (achievement.id == id) {
                return achievement;
            }
        }
        return console.log("没有该天赋id", id);
    };
    talentMgr.prototype.reqTalentInfo = function (msg) {
        var talentInfo = msg.getDataByType(dataids_1.dataids.ID_GET_TALENTINFO);
        console.log("-----天赋信息-----", talentInfo);
        this.talentPoint = talentInfo.talentPoints;
        this.lastResetTime = talentInfo.talentInfo.lastResetTime;
        this.talentInfo = talentInfo.talentInfo.talentInfo;
        this.isInit = true;
        this.initData();
    };
    talentMgr.prototype.sendReqTalentInfo = function () {
        var route = 'plaza.talent.reqTalentInfo';
        this.send_msg(route);
    };
    talentMgr.prototype.resetTalent = function (msg) {
        var crystalInfo = msg.getDataByType(dataids_1.dataids.ID_USER_MONEYFEN);
        var resetInfo = msg.getDataByType(76);
        console.log("-----重置天赋-----", crystalInfo, resetInfo);
        for (var i = 0; i < this.talentList.length; i++) {
            this.talentList[i].curLevel = 0;
        }
        this.talentPoint = resetInfo.talentPoints;
        this.lastResetTime = resetInfo.resetTime;
    };
    talentMgr.prototype.sendReqresetTalent = function (id) {
        var route = 'plaza.talent.resetTalent';
        var msg = {
            resetType: id,
        };
        this.send_msg(route, msg);
    };
    talentMgr.prototype.learnTalent = function (msg) {
        var talentInfo = msg.getDataByType(dataids_1.dataids.ID_GET_LEARNTALENT);
        console.log("-----升级天赋-----", talentInfo);
        this.talentPoint = talentInfo.talentPoints;
        for (var id in talentInfo.talentLvInfo) {
            var obj = this.selectTalent(id);
            obj.curLevel = talentInfo.talentLvInfo[id];
        }
    };
    talentMgr.prototype.sendReqLearnTalent = function (id) {
        var route = 'plaza.talent.learnTalent';
        var msg = {
            talentId: id,
        };
        this.send_msg(route, msg);
    };
    talentMgr.prototype.boolStudyState = function (talent) {
        console.log(talent);
        if (!talent.precondition) {
            return true;
        }
        else {
            var obj = this.selectTalent(talent.precondition);
            if (obj.curLevel == obj.maxLevel) {
                return true;
            }
            else {
                return false;
            }
        }
    };
    talentMgr.getInstance = function () {
        if (talentMgr._instance == null) {
            talentMgr._instance = new talentMgr();
        }
        return talentMgr._instance;
    };
    // 单例处理
    talentMgr._instance = null;
    return talentMgr;
}(BaseMgr_1.default));
exports.default = talentMgr;

cc._RF.pop();