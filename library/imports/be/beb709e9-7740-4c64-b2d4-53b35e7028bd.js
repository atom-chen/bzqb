"use strict";
cc._RF.push(module, 'beb70npd0BMZLLUU7NecCi9', 'taskMgr');
// manager/public/taskMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
/*
author: 陈斌杰
日期:2018-11-23 13:47:34
*/
var TaskMgr = /** @class */ (function (_super) {
    __extends(TaskMgr, _super);
    function TaskMgr() {
        var _this = _super.call(this) || this;
        _this.isFirst = false; //是否第一次打开
        _this.dailyTaskCfgTab = null; //每日任务配置表
        _this.activeBoxesCfgTab = null; //活跃度宝箱配置表
        _this.dailyTaskData = {}; //每日任务数据
        _this.activeBoxesData = {}; //活跃度宝箱数据
        _this.activity = 0; //当前活跃度
        _this.routes = {
            "plaza.data.reqDailyMissionInfo": _this.reqDailyMissionInfo,
        };
        return _this;
    }
    TaskMgr.getInstance = function () {
        if (TaskMgr._instance == null) {
            TaskMgr._instance = new TaskMgr();
        }
        return TaskMgr._instance;
    };
    //向服务器发送每日任务数据请求
    TaskMgr.prototype.sendReqDailyTaskData = function () {
        this.send_msg("plaza.data.reqDailyMissionInfo");
    };
    //获取服务器下发的每日任务数据
    TaskMgr.prototype.reqDailyMissionInfo = function (msg) {
        this.isFirst = true;
        var data = msg.getDataByType(dataids_1.dataids.ID_DAILYMISSIONINFO);
        this.getDailyTaskCfgTab();
        this.initDailyTaskData();
        this.initActiveBoxesData();
        this.setVitality(data.vitality);
        this.setDailyTaskData(data.arr);
    };
    //获取每日任务配置表
    TaskMgr.prototype.getDailyTaskCfgTab = function () {
        this.dailyTaskCfgTab = this.getConfigSync("dailyTask_dailyTask").json;
        this.activeBoxesCfgTab = this.getConfigSync("dailyTask_activeValueReward").json;
    };
    //初始化任务数据
    TaskMgr.prototype.initDailyTaskData = function () {
        this.dailyTaskData.list = [];
        for (var i = 0; i < this.dailyTaskCfgTab.length; i++) {
            var taskData = this.dailyTaskCfgTab[i];
            var dailyTask_1 = {};
            dailyTask_1.id = taskData.id;
            dailyTask_1.name = taskData.name;
            dailyTask_1.des = taskData.des;
            dailyTask_1.received = false;
            dailyTask_1.type = taskData.type;
            dailyTask_1.progress = 0;
            dailyTask_1.parameter = taskData.parameter;
            dailyTask_1.activeValue = taskData.activeValue;
            dailyTask_1.exp = taskData.exp;
            dailyTask_1.rewarks = [];
            for (var j = 0; j < taskData.reward.length; j++) {
                var data = taskData.reward[j];
                var rewark_1 = {};
                rewark_1.type = data.type;
                rewark_1.itemId = data.itemId;
                rewark_1.amount = data.amount;
                dailyTask_1.rewarks.push(rewark_1);
            }
            this.dailyTaskData.list.push(dailyTask_1);
        }
    };
    //初始化活跃度宝箱数据
    TaskMgr.prototype.initActiveBoxesData = function () {
        this.activeBoxesData.list = [];
        for (var i = 0; i < this.activeBoxesCfgTab.length; i++) {
            var boxesData = this.activeBoxesCfgTab[i];
            var activeBoxes_1 = {};
            activeBoxes_1.id = boxesData.id;
            activeBoxes_1.type = boxesData.type;
            activeBoxes_1.isOpen = false;
            activeBoxes_1.condition = boxesData.condition;
            activeBoxes_1.rewarks = [];
            for (var j = 0; j < boxesData.reward.length; j++) {
                var data = boxesData.reward[j];
                var rewark_2 = {};
                rewark_2.type = data.type;
                rewark_2.itemId = data.itemId;
                rewark_2.amount = data.amount;
                activeBoxes_1.rewarks.push(rewark_2);
            }
            this.activeBoxesData.list.push(activeBoxes_1);
        }
    };
    //设置每日任务数据
    TaskMgr.prototype.setDailyTaskData = function (data) {
        for (var i = 0; i < data.length; i++) {
            var taskData = data[i];
            for (var j = 0; j < this.dailyTaskData.list.length; j++) {
                var task = this.dailyTaskData.list[j];
                if (taskData.itemId == task.id) {
                    if (taskData.received == 1) {
                        task.received = true;
                    }
                    task.progress = taskData.src;
                    break;
                }
            }
        }
    };
    //设置当前活跃度
    TaskMgr.prototype.setVitality = function (vitality) {
        this.activity += vitality;
    };
    //判断是否可以打开
    TaskMgr.prototype.getIsCanOpenBoxes = function (boxesId) {
        var isCanOpen = false;
        for (var i = 0; i < this.activeBoxesData.list.length; i++) {
            var boxData = this.activeBoxesData.list[i];
            if (boxesId == boxData.id && boxData.condition < this.activity) {
                boxData.isOpen = true;
            }
        }
        return isCanOpen;
    };
    // 单例处理
    TaskMgr._instance = null;
    return TaskMgr;
}(BaseMgr_1.default));
exports.default = TaskMgr;

cc._RF.pop();