"use strict";
cc._RF.push(module, 'fd25aD/12ZFrLxvgBapMQ2A', 'dailyTask');
// modules/plaza/script/dailyTask/dailyTask.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var taskMgr_1 = require("../../../../manager/public/taskMgr");
/*
author: 陈斌杰
日期:2018-11-22 18:51:51
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.dailyTaskData = taskMgr_1.default.getInstance().dailyTaskData; //每日任务数据
        _this.activeBoxesData = taskMgr_1.default.getInstance().activeBoxesData; //活跃度宝箱数据
        return _this;
    }
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            progressBar: ctrl.progressBar,
            progressBoxes: ctrl.progressBoxes,
            activeBoxes: ctrl.boxesRewark,
            taskContent: ctrl.taskContent,
            task: ctrl.task,
            bottomFrame: ctrl.bottomFrame,
            activeCount: ctrl.activeCount,
            btn_close: ctrl.btn_close,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.refreshActivityUI();
        this.initDailyTaskUI();
        this.initActiveBoxesUI();
    };
    //初始化每日任务数据
    View.prototype.initDailyTaskUI = function () {
        this.ui.taskContent.height = this.model.dailyTaskData.list.length * 80;
        for (var i = 0; i < this.model.dailyTaskData.list.length; i++) {
            var taskData = this.model.dailyTaskData.list[i];
            var taskNode = this.addPrefabNode(this.ui.task, this.ui.taskContent);
            taskNode.y = -40 - i * 80;
            taskNode.getComponent("task").initDailyTask(taskData);
        }
    };
    //初始化活跃度宝箱
    View.prototype.initActiveBoxesUI = function () {
        for (var i = 0; i < this.model.activeBoxesData.list.length; i++) {
            var boxesData = this.model.activeBoxesData.list[i];
            if (boxesData.id < 2000) {
                var activeBoxesNode = this.addPrefabNode(this.ui.activeBoxes, this.ui.progressBoxes);
                activeBoxesNode.x = 180 * i - 195;
                activeBoxesNode.getComponent("taskBoxes").initActiveBoxe(boxesData);
            }
            else {
                var activeBoxesNode = this.addPrefabNode(this.ui.activeBoxes, this.ui.bottomFrame);
                activeBoxesNode.x = 75 + (i - 4) * 225;
                activeBoxesNode.y = 10;
                activeBoxesNode.getComponent("taskBoxes").initActiveBoxe(boxesData);
            }
        }
    };
    //刷新活跃度显示
    View.prototype.refreshActivityUI = function () {
        this.ui.progressBar.string = taskMgr_1.default.getInstance().activity.toString();
    };
    //刷新活跃度进度条显示
    View.prototype.refreshProgressBarUI = function () {
    };
    return View;
}(BaseView_1.default));
//c, 控制
var DailyTaskCtrl = /** @class */ (function (_super) {
    __extends(DailyTaskCtrl, _super);
    function DailyTaskCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.progressBar = null;
        _this.progressBoxes = null;
        _this.boxesRewark = null;
        _this.activeCount = null;
        _this.taskContent = null;
        _this.task = null;
        _this.bottomFrame = null;
        _this.btn_close = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    DailyTaskCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    DailyTaskCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    DailyTaskCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    DailyTaskCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_close, function () {
            _this.closeModule("dailyTask");
        }, "关闭每日任务界面");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    DailyTaskCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Label)
    ], DailyTaskCtrl.prototype, "progressBar", void 0);
    __decorate([
        property(cc.Node)
    ], DailyTaskCtrl.prototype, "progressBoxes", void 0);
    __decorate([
        property(cc.Prefab)
    ], DailyTaskCtrl.prototype, "boxesRewark", void 0);
    __decorate([
        property(cc.Node)
    ], DailyTaskCtrl.prototype, "activeCount", void 0);
    __decorate([
        property(cc.Node)
    ], DailyTaskCtrl.prototype, "taskContent", void 0);
    __decorate([
        property(cc.Prefab)
    ], DailyTaskCtrl.prototype, "task", void 0);
    __decorate([
        property(cc.Node)
    ], DailyTaskCtrl.prototype, "bottomFrame", void 0);
    __decorate([
        property(cc.Node)
    ], DailyTaskCtrl.prototype, "btn_close", void 0);
    DailyTaskCtrl = __decorate([
        ccclass
    ], DailyTaskCtrl);
    return DailyTaskCtrl;
}(BaseCtrl_1.default));
exports.default = DailyTaskCtrl;

cc._RF.pop();