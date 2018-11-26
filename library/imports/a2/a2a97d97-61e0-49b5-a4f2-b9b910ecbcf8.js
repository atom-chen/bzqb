"use strict";
cc._RF.push(module, 'a2a972XYeBJtaTyubkQ7Lz4', 'suspensionframe');
// modules/plaza/script/talent/suspensionframe.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var talentMgr_1 = require("../../../../manager/public/talentMgr");
/*
author: 蒙磊
日期:2018-11-19 11:15:19
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.talent = null;
        return _this;
    }
    Model.prototype.setData = function (data) {
        this.talent = data;
        this.id = data.id;
        this.name = data.name;
        this.level = "等级:" + data.curLevel + "/" + data.maxLevel;
        var curLevel = data.curLevel - 1;
        var nextLevel = curLevel >= (data.maxLevel - 1) ? curLevel : curLevel + 1;
        if (!data.value) {
            if (curLevel == -1) {
                this.curDes = "未习得";
            }
            else {
                this.curDes = data.des;
            }
            this.nextDes = data.des;
        }
        else {
            if (curLevel == -1) {
                this.curDes = "未习得";
            }
            else {
                this.curDes = this.stringReplace(data.des, "X", data.value[curLevel].value);
            }
            this.nextDes = this.stringReplace(data.des, "X", data.value[nextLevel].value);
        }
        if (curLevel == nextLevel) {
            this.nextDes = "当前已满级";
        }
    };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            //在这里声明ui
            lab_name: ctrl.lab_name,
            lab_level: ctrl.lab_level,
            lab_curDes: ctrl.lab_curDes,
            lab_nexDes: ctrl.lab_nexDes,
            btn_close: ctrl.btn_close,
            btn_levelUp: ctrl.btn_levelUp,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    //显示label内容
    View.prototype.showLabelString = function (obj, content) {
        obj.string = content;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var SuspensionframeCtrl = /** @class */ (function (_super) {
    __extends(SuspensionframeCtrl, _super);
    function SuspensionframeCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        //label 
        _this.lab_name = null;
        _this.lab_level = null;
        _this.lab_curDes = null;
        _this.lab_nexDes = null;
        //button
        _this.btn_close = null;
        _this.btn_levelUp = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    SuspensionframeCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    SuspensionframeCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'plaza.talent.learnTalent': this.learnTalent,
        };
    };
    //定义全局事件
    SuspensionframeCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    SuspensionframeCtrl.prototype.connectUi = function () {
        this.connect("click", this.ui.btn_levelUp, this.levelUp, "升级天赋");
        this.connect("click", this.ui.btn_close, this.close, "关闭学习天赋");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    //关闭升级界面
    SuspensionframeCtrl.prototype.close = function () {
        this.node.destroy();
        talentMgr_1.default.getInstance().curTalent = null;
    };
    //升级天赋按钮回调
    SuspensionframeCtrl.prototype.levelUp = function () {
        if (talentMgr_1.default.getInstance().talentPoint <= 0) {
            console.log("没有天赋点了！");
        }
        else if (!talentMgr_1.default.getInstance().boolStudyState(this.model.talent)) {
            console.log("学习天赋条件未达成");
        }
        else {
            talentMgr_1.default.getInstance().sendReqLearnTalent(this.model.id);
        }
    };
    SuspensionframeCtrl.prototype.learnTalent = function () {
        this.showData();
    };
    // update(dt) {}
    //设置天赋数据
    SuspensionframeCtrl.prototype.setData = function (data) {
        this.model.setData(data);
    };
    //显示天赋数据
    SuspensionframeCtrl.prototype.showData = function () {
        this.view.showLabelString(this.ui.lab_name, this.model.name);
        this.view.showLabelString(this.ui.lab_level, this.model.level);
        this.view.showLabelString(this.ui.lab_curDes, this.model.curDes);
        this.view.showLabelString(this.ui.lab_nexDes, this.model.nextDes);
    };
    SuspensionframeCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Label)
    ], SuspensionframeCtrl.prototype, "lab_name", void 0);
    __decorate([
        property(cc.Label)
    ], SuspensionframeCtrl.prototype, "lab_level", void 0);
    __decorate([
        property(cc.Label)
    ], SuspensionframeCtrl.prototype, "lab_curDes", void 0);
    __decorate([
        property(cc.Label)
    ], SuspensionframeCtrl.prototype, "lab_nexDes", void 0);
    __decorate([
        property(cc.Node)
    ], SuspensionframeCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Node)
    ], SuspensionframeCtrl.prototype, "btn_levelUp", void 0);
    SuspensionframeCtrl = __decorate([
        ccclass
    ], SuspensionframeCtrl);
    return SuspensionframeCtrl;
}(BaseCtrl_1.default));
exports.default = SuspensionframeCtrl;

cc._RF.pop();