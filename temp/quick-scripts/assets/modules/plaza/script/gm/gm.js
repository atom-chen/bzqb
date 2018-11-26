(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/gm/gm.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cee56IODT9NR7m0hdOGcFTY', 'gm', __filename);
// modules/plaza/script/gm/gm.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var gmMgr_1 = require("../../../../manager/public/gmMgr");
/*
author: 蔡世达
日期:2018-11-24 14:18:08
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.json = gmMgr_1.default.getInstance().data;
        return _this;
    }
    Model.prototype.getData = function () { return this.json; };
    Model.prototype.setCurType = function (curType) { this.curType = curType; };
    Model.prototype.getCurType = function () { return this.curType; };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            lblMgrType: ctrl.nodeData.getChildByName("lbltype"),
            editParam1: ctrl.nodeData.getChildByName("nodeParam1").getChildByName("edit"),
            editParam2: ctrl.nodeData.getChildByName("nodeParam2").getChildByName("edit"),
            lblParam1: ctrl.nodeData.getChildByName("nodeParam1").getChildByName("lbl"),
            lblParam2: ctrl.nodeData.getChildByName("nodeParam2").getChildByName("lbl"),
            btn_OK: ctrl.nodeData.getChildByName("btn"),
            nodeGMMgrType: ctrl.nodeGMMgrType,
            prefab_btn: ctrl.btn,
            btn_close: ctrl.node.getChildByName("bg1"),
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    View.prototype.setlblParam1 = function (param) {
        if (!param) {
            this.ui.lblParam1.parent.active = false;
            return;
        }
        else {
            this.ui.lblParam1.parent.active = true;
        }
        this.ui.lblParam1.getComponent(cc.Label).string = param;
    };
    View.prototype.setlblParam2 = function (param) {
        if (!param) {
            this.ui.lblParam2.parent.active = false;
            return;
        }
        else {
            this.ui.lblParam2.parent.active = true;
        }
        this.ui.lblParam2.getComponent(cc.Label).string = param;
    };
    View.prototype.getParam1 = function () {
        return this.ui.editParam1.getComponent(cc.EditBox).string;
    };
    View.prototype.getParam2 = function () {
        return this.ui.editParam2.getComponent(cc.EditBox).string;
    };
    //初始化ui
    View.prototype.initUi = function () {
    };
    View.prototype.UpdateGmUI = function () {
        var data = this.model.getData();
        this.ui.nodeGMMgrType.destroyAllChildren();
        for (var i = 0; i < data.length; i++) {
            var btn_type = this.addPrefabNode(this.ui.prefab_btn, this.ui.nodeGMMgrType);
            btn_type.getChildByName("lbl").getComponent(cc.Label).string = data[i].des;
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = ctrl.node; //这个 node 节点是你的事件处理代码组件所属的节点
            clickEventHandler.component = "gm"; //这个是代码文件名
            clickEventHandler.handler = "callback";
            clickEventHandler.customEventData = data[i];
            var button = btn_type.getComponent(cc.Button);
            button.clickEvents.push(clickEventHandler);
        }
    };
    View.prototype.UpdateTypeUI = function () {
        var curType = this.model.getCurType();
        this.setlblMgrType(curType.des);
        this.setlblParam1(curType.param1);
        this.setlblParam2(curType.param2);
        this.ui.editParam1.getComponent(cc.EditBox).string = "";
        this.ui.editParam2.getComponent(cc.EditBox).string = "";
    };
    View.prototype.setlblMgrType = function (type) {
        this.ui.lblMgrType.getComponent(cc.Label).string = type;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var GMCtrl = /** @class */ (function (_super) {
    __extends(GMCtrl, _super);
    function GMCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.nodeGMMgrType = null;
        _this.nodeData = null;
        _this.btn = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    GMCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
        this.view.UpdateGmUI();
    };
    //定义网络事件
    GMCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
        //"plaza.friend.applyFriend": this.applyFriend,
        };
    };
    //定义全局事件
    GMCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    GMCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_OK, function () {
            var curType = _this.model.getCurType();
            if (!curType) {
                return;
            }
            gmMgr_1.default.getInstance().sendData(curType.name, _this.view.getParam1(), _this.view.getParam2());
        }, "发送GM修改" + this.model.getCurType());
        this.connect("click", this.ui.btn_close, function () {
            _this.closeModule("gm");
        }, "");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    GMCtrl.prototype.callback = function (event, customEventData) {
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "foobar"
        this.model.setCurType(customEventData);
        this.view.UpdateTypeUI();
    };
    GMCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], GMCtrl.prototype, "nodeGMMgrType", void 0);
    __decorate([
        property(cc.Node)
    ], GMCtrl.prototype, "nodeData", void 0);
    __decorate([
        property(cc.Prefab)
    ], GMCtrl.prototype, "btn", void 0);
    GMCtrl = __decorate([
        ccclass
    ], GMCtrl);
    return GMCtrl;
}(BaseCtrl_1.default));
exports.default = GMCtrl;

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
        //# sourceMappingURL=gm.js.map
        