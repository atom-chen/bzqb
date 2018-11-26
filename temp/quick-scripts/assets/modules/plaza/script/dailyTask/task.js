(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/dailyTask/task.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8e65cbwKx9K/bWktqBGL4s9', 'task', __filename);
// modules/plaza/script/dailyTask/task.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
/*
author: 陈斌杰
日期:2018-11-23 11:40:29
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.dailyTaskData = {};
        return _this;
    }
    //设置每日任务数据
    Model.prototype.setDailuTaskData = function (data) {
        this.dailyTaskData = data;
    };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            ico: ctrl.ico,
            title: ctrl.title,
            content: ctrl.content,
            rewarks: ctrl.rewarks,
            rewark: ctrl.rewark,
            progress_lab: ctrl.progress_lab,
            progressBtnLab: ctrl.progressBtnLab,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.ui.progressBtnLab.string = "前往";
    };
    //初始化每日任务UI
    View.prototype.initDailyTaskUI = function () {
        this.ui.title.string = this.model.dailyTaskData.name;
        this.ui.content.string = this.model.dailyTaskData.des;
        for (var i = 0; i < this.model.dailyTaskData.rewarks.length; i++) {
            var rewarkData = this.model.dailyTaskData.rewarks[i];
            var rewarkNode = this.addPrefabNode(this.ui.rewark, this.ui.rewarks);
            rewarkNode.setContentSize(65, 65);
            rewarkNode.x = 325 - i * 80;
            rewarkNode.getComponent("boxRewark").initTotalRewark(rewarkData);
        }
        this.ui.progress_lab.string = "\u8FDB\u5EA6" + this.model.dailyTaskData.progress + "/" + this.model.dailyTaskData.parameter;
        if (this.model.dailyTaskData.received) {
            this.ui.progressBtnLab.string = "已领取";
            return;
        }
        if (this.model.dailyTaskData.progress == this.model.dailyTaskData.parameter) {
            this.ui.progressBtnLab.string = "完成";
        }
    };
    return View;
}(BaseView_1.default));
//c, 控制
var TaskCtrl = /** @class */ (function (_super) {
    __extends(TaskCtrl, _super);
    function TaskCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.ico = null;
        _this.title = null;
        _this.content = null;
        _this.rewark = null;
        _this.progress_lab = null;
        _this.rewarks = null;
        _this.progressBtnLab = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    TaskCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    TaskCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    TaskCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    TaskCtrl.prototype.connectUi = function () {
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    //初始化任务
    TaskCtrl.prototype.initDailyTask = function (data) {
        this.model.setDailuTaskData(data);
        this.view.initDailyTaskUI();
    };
    TaskCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Sprite)
    ], TaskCtrl.prototype, "ico", void 0);
    __decorate([
        property(cc.Label)
    ], TaskCtrl.prototype, "title", void 0);
    __decorate([
        property(cc.Label)
    ], TaskCtrl.prototype, "content", void 0);
    __decorate([
        property(cc.Prefab)
    ], TaskCtrl.prototype, "rewark", void 0);
    __decorate([
        property(cc.Label)
    ], TaskCtrl.prototype, "progress_lab", void 0);
    __decorate([
        property(cc.Node)
    ], TaskCtrl.prototype, "rewarks", void 0);
    __decorate([
        property(cc.Label)
    ], TaskCtrl.prototype, "progressBtnLab", void 0);
    TaskCtrl = __decorate([
        ccclass
    ], TaskCtrl);
    return TaskCtrl;
}(BaseCtrl_1.default));
exports.default = TaskCtrl;

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
        //# sourceMappingURL=task.js.map
        