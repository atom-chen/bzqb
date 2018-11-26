(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/friends/talk.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6b0ccQr089D+bnSQWHcZ19q', 'talk', __filename);
// modules/plaza/script/friends/talk.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var userMgr_1 = require("../../../../manager/public/userMgr");
/*
author: 蔡世达
日期:2018-11-21 15:26:46
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.chatData = {};
        _this.myInfo = userMgr_1.default.getInstance().getMyInfo();
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
            head: ctrl.node.getChildByName("head"),
            name: ctrl.node.getChildByName("name"),
            word: ctrl.node.getChildByName("frame").getChildByName("word"),
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    View.prototype.updateUI = function () {
        var name = "";
        if (this.model.myInfo.userUID == this.model.chatData.fromID) {
            name = this.model.myInfo.userName;
        }
        else {
            if (this.model.userInfo) {
                var info = this.model.userInfo;
                name = info.nickname;
            }
        }
        this.ui.name.getComponent(cc.Label).string = name;
        this.ui.word.getComponent(cc.Label).string = this.model.chatData.content;
    };
    View.prototype.UpdateUserInfo = function () {
        var name;
        if (this.model.myInfo.userUID == this.model.chatData.fromID) {
            name = this.model.myInfo.userName;
        }
        else {
            var info = this.model.userInfo;
            name = info.nickname;
        }
        this.ui.name.getComponent(cc.Label).string = name;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var TalkCtrl = /** @class */ (function (_super) {
    __extends(TalkCtrl, _super);
    function TalkCtrl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //这边去声明ui组件
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    TalkCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    TalkCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    TalkCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    TalkCtrl.prototype.connectUi = function () {
    };
    TalkCtrl.prototype.setData = function (chatData, userInfo) {
        this.model.chatData = chatData;
        this.model.userInfo = userInfo;
        this.view.updateUI();
    };
    TalkCtrl.prototype.setUserInfo = function (userInfo) {
        this.model.userInfo = userInfo;
        this.view.UpdateUserInfo();
    };
    TalkCtrl.prototype.getID = function () {
        return this.model.chatData.fromID;
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    TalkCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    TalkCtrl = __decorate([
        ccclass
    ], TalkCtrl);
    return TalkCtrl;
}(BaseCtrl_1.default));
exports.default = TalkCtrl;

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
        //# sourceMappingURL=talk.js.map
        