(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/dailyTask/taskBoxes.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fe32dk/WCNHfLQkzmrN73pl', 'taskBoxes', __filename);
// modules/plaza/script/dailyTask/taskBoxes.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var taskMgr_1 = require("../../../../manager/public/taskMgr");
/*
author: 陈斌杰
日期:2018-11-23 13:55:44
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.boxesData = {};
        return _this;
    }
    //设置活动宝箱数据
    Model.prototype.setActiveBoxesData = function (data) {
        this.boxesData = data;
    };
    //设置宝箱开启数据
    Model.prototype.setBoxesOpenState = function (data) {
        this.boxesData.isOpen = true;
        this.boxesData.rewarks = [];
    };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            boxesIco: ctrl.boxesIco,
            activeNum: ctrl.activeNum,
            circle_bg: ctrl.circle_bg,
            rewarkInfo: ctrl.rewarkInfo,
            rewark: ctrl.rewark,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    //初始化活跃度宝箱UI
    View.prototype.initActiveBoxesUI = function () {
        var _this = this;
        if (this.model.boxesData.id < 2000) {
            var namePic = [3, 7, 14, 21];
            var index = this.model.boxesData.id - 1001;
            var name = null;
            if (this.model.boxesData.isOpen) {
                name = "openBox_" + namePic[index];
            }
            else {
                name = "box_" + namePic[index];
            }
            this.loadImage(name).then(function (sprf) {
                _this.ui.boxesIco.spriteFrame = sprf;
            });
        }
        else {
            this.ui.circle_bg.active = false;
            this.ui.activeNum.node.parent.width = 120;
        }
        this.ui.activeNum.string = this.model.boxesData.condition.toString();
    };
    //显示宝箱奖励
    View.prototype.showBoxesRewarks = function () {
        this.ui.rewarkInfo.getChildByName("bg").width = 80 * this.model.boxesData.rewarks.length;
        if (this.ui.rewarkInfo.active == true) {
            this.ui.rewarkInfo.active = false;
        }
        else {
            this.ui.rewarkInfo.active = true;
        }
        if (this.ui.rewarkInfo.childrenCount > 2) {
            return;
        }
        for (var i = 0; i < this.model.boxesData.rewarks.length; i++) {
            var boxData = this.model.boxesData.rewarks[i];
            var boxNode = this.addPrefabNode(this.ui.rewark, this.ui.rewarkInfo);
            boxNode.x = -40 * (this.model.boxesData.rewarks.length - 1) + i * 80;
            boxNode.getComponent("boxRewark").initTotalRewark(boxData);
        }
    };
    //刷新宝箱图片显示
    View.prototype.refreshBoxesUI = function () {
        this.initActiveBoxesUI();
    };
    return View;
}(BaseView_1.default));
//c, 控制
var TaskBoxesCtrl = /** @class */ (function (_super) {
    __extends(TaskBoxesCtrl, _super);
    function TaskBoxesCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.boxesIco = null;
        _this.activeNum = null;
        _this.circle_bg = null;
        _this.rewarkInfo = null;
        _this.rewark = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    TaskBoxesCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    TaskBoxesCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    TaskBoxesCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    TaskBoxesCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.node, function () {
            if (_this.model.boxesData.isOpen) {
                return;
            }
            if (taskMgr_1.default.getInstance().getIsCanOpenBoxes(_this.model.boxesData.id)) {
                console.log("---------发送开启活跃度宝箱请求----------");
                return;
            }
            _this.view.showBoxesRewarks();
        }, "点击活跃度宝箱显示奖励");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    //初始化活跃度宝箱
    TaskBoxesCtrl.prototype.initActiveBoxe = function (data) {
        this.model.setActiveBoxesData(data);
        this.view.initActiveBoxesUI();
    };
    //刷新宝箱显示
    TaskBoxesCtrl.prototype.refreshBoxes = function (data) {
        var _this = this;
        this.model.setBoxesOpenState(data);
        this.view.refreshBoxesUI();
        this.openSubModule("gainBox", true).then(function (script) {
            script.setGainData(_this.model.boxesData.rewarks);
        });
    };
    TaskBoxesCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Sprite)
    ], TaskBoxesCtrl.prototype, "boxesIco", void 0);
    __decorate([
        property(cc.Label)
    ], TaskBoxesCtrl.prototype, "activeNum", void 0);
    __decorate([
        property(cc.Node)
    ], TaskBoxesCtrl.prototype, "circle_bg", void 0);
    __decorate([
        property(cc.Node)
    ], TaskBoxesCtrl.prototype, "rewarkInfo", void 0);
    __decorate([
        property(cc.Prefab)
    ], TaskBoxesCtrl.prototype, "rewark", void 0);
    TaskBoxesCtrl = __decorate([
        ccclass
    ], TaskBoxesCtrl);
    return TaskBoxesCtrl;
}(BaseCtrl_1.default));
exports.default = TaskBoxesCtrl;

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
        //# sourceMappingURL=taskBoxes.js.map
        