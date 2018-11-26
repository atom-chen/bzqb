(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/matching/matching.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '90673kzd0tHqIGIfECTgEy9', 'matching', __filename);
// modules/plaza/script/matching/matching.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var matchMgr_1 = require("../../../../manager/public/matchMgr");
/*
author: 蒙磊
日期:2018-11-02 18:51:46
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
var ROOMSTATE;
(function (ROOMSTATE) {
    ROOMSTATE[ROOMSTATE["CHOSE"] = 0] = "CHOSE";
    ROOMSTATE[ROOMSTATE["ROOM"] = 1] = "ROOM";
    ROOMSTATE[ROOMSTATE["LOADING"] = 2] = "LOADING";
})(ROOMSTATE || (ROOMSTATE = {}));
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.roomState = ROOMSTATE.CHOSE;
        return _this;
    }
    Model.prototype.initTime = function () {
        this.second = 0;
    };
    Model.prototype.addTime = function () {
        ++this.second;
    };
    Model.prototype.setRoomState = function (roomState) {
        this.roomState = roomState;
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
            note_room: ctrl.note_room,
            note_running: ctrl.note_running,
            note_chose: ctrl.note_chose,
            note_loading: ctrl.note_loading,
            btn_room: ctrl.btn_room,
            btn_back: ctrl.btn_back,
            btn_tumble: ctrl.btn_tumble,
            btn_begin: ctrl.btn_begin,
            btn_cancel: ctrl.btn_cancel,
            lab_time: ctrl.lab_time,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    View.prototype.hide = function (name) {
        this.ui[name].active = false;
    };
    View.prototype.show = function (name) {
        this.ui[name].active = true;
    };
    View.prototype.showTime = function () {
        var minute = Math.floor(this.model.second / 60);
        var mString = minute >= 10 ? minute.toString() : "0" + minute;
        var second = this.model.second % 60;
        var sString = second >= 10 ? second.toString() : "0" + second;
        this.ui.lab_time.getComponent(cc.Label).string = mString + ":" + sString;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var MatchingCtrl = /** @class */ (function (_super) {
    __extends(MatchingCtrl, _super);
    function MatchingCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.note_chose = null;
        _this.note_room = null;
        _this.note_running = null;
        _this.note_loading = null;
        _this.btn_room = null;
        _this.btn_back = null;
        _this.btn_tumble = null;
        _this.btn_begin = null;
        _this.btn_cancel = null;
        _this.lab_time = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    MatchingCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    MatchingCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'match.match.match': this._match,
            'match.match.stopMatch': this._stopMatch
        };
    };
    //定义全局事件
    MatchingCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    MatchingCtrl.prototype.connectUi = function () {
        this.connect("click", this.ui.btn_room, this.roomCB, "进入房间");
        this.connect("click", this.ui.btn_back, this.backCB, "返回");
        this.connect("click", this.ui.btn_cancel, this._cancelCB, "取消匹配");
        this.connect("click", this.ui.btn_tumble, this.tumbleCB, "进入乱斗");
        this.connect("click", this.ui.btn_begin, this._beginCB, "房间开始");
    };
    //网络事件回调begin
    MatchingCtrl.prototype._match = function () {
    };
    MatchingCtrl.prototype._stopMatch = function () {
        this.unschedule(this._timer);
        this.view.hide("note_running");
        this.view.show("note_room");
        this.model.setRoomState(ROOMSTATE.ROOM);
    };
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    MatchingCtrl.prototype.roomCB = function () {
        this.view.show("note_room");
        this.view.hide("note_chose");
        this.model.setRoomState(ROOMSTATE.ROOM);
    };
    MatchingCtrl.prototype.backCB = function () {
        cc.log(this.model.roomState);
        switch (this.model.roomState) {
            case ROOMSTATE.CHOSE:
                this.closeModule("matching");
                break;
            case ROOMSTATE.ROOM:
                this.closeModule("matching");
                break;
        }
    };
    MatchingCtrl.prototype._cancelCB = function () {
        matchMgr_1.default.getInstance().sendStopMatch();
    };
    MatchingCtrl.prototype.tumbleCB = function () {
        this.view.show("note_running");
        this._startTimer();
    };
    MatchingCtrl.prototype._beginCB = function () {
        this.view.show("note_running");
        this._startTimer();
        matchMgr_1.default.getInstance().sendMatch();
        this.model.setRoomState(ROOMSTATE.LOADING);
    };
    //计时
    MatchingCtrl.prototype._startTimer = function () {
        this.model.initTime();
        this.view.showTime();
        this.schedule(this._timer, 1);
    };
    MatchingCtrl.prototype._timer = function () {
        this.model.addTime();
        this.view.showTime();
    };
    //加载loading
    MatchingCtrl.prototype.loading = function () {
        this.closeModule("matching");
        this.openSubModule("loading");
    };
    // update(dt) {}
    MatchingCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], MatchingCtrl.prototype, "note_chose", void 0);
    __decorate([
        property(cc.Node)
    ], MatchingCtrl.prototype, "note_room", void 0);
    __decorate([
        property(cc.Node)
    ], MatchingCtrl.prototype, "note_running", void 0);
    __decorate([
        property(cc.Node)
    ], MatchingCtrl.prototype, "note_loading", void 0);
    __decorate([
        property(cc.Node)
    ], MatchingCtrl.prototype, "btn_room", void 0);
    __decorate([
        property(cc.Node)
    ], MatchingCtrl.prototype, "btn_back", void 0);
    __decorate([
        property(cc.Node)
    ], MatchingCtrl.prototype, "btn_tumble", void 0);
    __decorate([
        property(cc.Node)
    ], MatchingCtrl.prototype, "btn_begin", void 0);
    __decorate([
        property(cc.Node)
    ], MatchingCtrl.prototype, "btn_cancel", void 0);
    __decorate([
        property(cc.Node)
    ], MatchingCtrl.prototype, "lab_time", void 0);
    MatchingCtrl = __decorate([
        ccclass
    ], MatchingCtrl);
    return MatchingCtrl;
}(BaseCtrl_1.default));
exports.default = MatchingCtrl;

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
        //# sourceMappingURL=matching.js.map
        