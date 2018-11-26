"use strict";
cc._RF.push(module, '1fe6fzWGR9C6ZLxwU8vaa9y', 'achievementMgr');
// manager/public/achievementMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
var userMgr_1 = require("./userMgr");
var userMgr = userMgr_1.default.getInstance();
var AchievementMgr = /** @class */ (function (_super) {
    __extends(AchievementMgr, _super);
    function AchievementMgr() {
        var _this = _super.call(this) || this;
        _this.achievementTabal = null;
        _this.achievement = [];
        //public achievementId = [1001, 1009, 1018, 1024, 1030, 1036, 1043, 1048, 1053];
        _this.isInit = false;
        _this.routes = {
            "plaza.data.reqAchieveInfo": _this.reqAchieveInfo,
        };
        return _this;
    }
    AchievementMgr.prototype.selectAchievement = function (id) {
        for (var i = 0; i < this.achievementTabal.length; i++) {
            var achievement = this.achievementTabal[i];
            if (achievement.id == id) {
                return achievement;
            }
        }
        return console.log("没有该成就id", id);
    };
    AchievementMgr.prototype.sendReqAchieveInfo = function () {
        var route = 'plaza.data.reqAchieveInfo';
        this.send_msg(route);
    };
    AchievementMgr.prototype.reqAchieveInfo = function (msg) {
        this.isInit = true;
        var achievementInfo = msg.getDataByType(dataids_1.dataids.ID_ACHIEVEINFO);
        console.log("-----成就信息-----", achievementInfo);
        this.initAchieveData(achievementInfo.arr);
    };
    AchievementMgr.prototype.initAchieveData = function (data) {
        //查表
        this.achievementTabal = this.getConfigSync("chengjiu_Achievement").json;
        for (var i = 0; i < data.length; i++) {
            data[i].tableInfo = this.selectAchievement(data[i].itemId);
        }
        this.achievement = data;
        cc.log("---成就---", this.achievement);
    };
    AchievementMgr.getInstance = function () {
        if (AchievementMgr._instance == null) {
            AchievementMgr._instance = new AchievementMgr();
        }
        return AchievementMgr._instance;
    };
    // 单例处理
    AchievementMgr._instance = null;
    return AchievementMgr;
}(BaseMgr_1.default));
exports.default = AchievementMgr;

cc._RF.pop();