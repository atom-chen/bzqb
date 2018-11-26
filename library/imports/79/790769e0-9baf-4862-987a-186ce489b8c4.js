"use strict";
cc._RF.push(module, '79076ngm69IYph6GGzkibjE', 'mails');
// modules/plaza/script/mails/mails.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var mailMgr_1 = require("../../../../manager/public/mailMgr");
var userMgr_1 = require("../../../../manager/public/userMgr");
var enums_1 = require("../../../../manager/enums");
/*
author: 陈斌杰
日期:2018-11-09 15:52:05
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.user = userMgr_1.default.getInstance().user;
        _this.mailsData = mailMgr_1.default.getInstance().mailsData;
        _this.mailExplain = {}; //当前显示的邮件详情的邮件数据
        _this.boxesRewarkData = []; //宝箱数据
        return _this;
    }
    //设置邮件详情数据
    Model.prototype.setMailExplainData = function (id) {
        for (var i = 0; i < this.mailsData.list.length; i++) {
            var mailData = this.mailsData.list[i];
            if (mailData.id == id) {
                this.mailExplain = mailData;
                break;
            }
        }
    };
    //处理宝箱数据
    Model.prototype.setBoxesRewarkData = function () {
        var boxesData = mailMgr_1.default.getInstance().boxesRewark;
        for (var i = 0; i < boxesData.length; i++) {
            var data = boxesData[i]; //宝箱数据
            var arr = [];
            var item = {};
            item.type = enums_1.enums.Get_Gold;
            item.amount = data.addMoneyGold;
            arr.push(item);
            for (var j = 0; j < data.listTejis.length; j++) {
                var effectData = data.listTejis[j];
                var effectItem = {};
                effectItem.type = enums_1.enums.Get_Skill;
                effectItem.amount = effectData.amount;
                arr.push(effectItem);
            }
            this.boxesRewarkData.push(arr);
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
            btn_close: ctrl.btn_close,
            mailsList: ctrl.mailsList,
            mail: ctrl.mail,
            mailsExplain_title: ctrl.mailsExplain_title,
            mailsExplain_name: ctrl.mailsExplain_name,
            mailsExplain_content: ctrl.mailsExplain_content,
            mailsCount: ctrl.mailsCount,
            mailRewark: ctrl.mailRewark,
            btn_receive: ctrl.rewarkFrame.getChildByName("btn_receive"),
            btn_del: ctrl.rewarkFrame.getChildByName("btn_del"),
            rewarks: ctrl.rewarkFrame.getChildByName("rewarks"),
            btn_allReceive: ctrl.btn_allReceive,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.ui.mailsList.height = 7500;
        this.initMailsList();
        this.ui.mailsExplain_title.string = "";
        this.ui.mailsExplain_name.string = "";
        this.ui.mailsExplain_content.string = "";
        this.ui.mailsCount.string = mailMgr_1.default.getInstance().mailCount + "/100";
        this.ui.btn_receive.active = false;
        this.ui.btn_del.active = false;
    };
    //初始化邮件列表
    View.prototype.initMailsList = function () {
        if (this.ui.mailsList.childrenCount > 0) {
            this.ui.mailsList.destroyAllChildren();
        }
        for (var i = 0; i < this.model.mailsData.list.length; i++) {
            var mailData = this.model.mailsData.list[i];
            var mailNode = this.addPrefabNode(this.ui.mail, this.ui.mailsList);
            mailNode.y = -75 * i - 35;
            mailNode.getComponent("mail").initMailData(mailData);
        }
    };
    //刷新邮件详情显示
    View.prototype.refreshMailExplainUI = function () {
        this.delMailRewark();
        this.ui.mailsExplain_title.string = "邮件详情";
        this.ui.mailsExplain_name.string = "\u4EB2\u7231\u7684" + this.model.user.userName + ":";
        this.ui.mailsExplain_content.string = this.model.mailExplain.content;
        this.refreshMailIco();
        this.refreshMailBgColor();
        this.refreshMailRewarksUI();
    };
    //当前邮件ico刷新  未读取变成已读取
    View.prototype.refreshMailIco = function () {
        for (var i = 0; i < this.ui.mailsList.childrenCount; i++) {
            var mailNode = this.ui.mailsList.children[i];
            var id = mailNode.getComponent("mail").model.mailData.id;
            if (id == this.model.mailExplain.id) {
                mailNode.getComponent("mail").refreshMailState();
                break;
            }
        }
    };
    //刷新全部邮件Ico  未读取变成已读取
    View.prototype.refreshAllMailIco = function () {
        for (var i = 0; i < this.ui.mailsList.childrenCount; i++) {
            var mailNode = this.ui.mailsList.children[i];
            mailNode.getComponent("mail").refreshMailState();
        }
    };
    //刷新邮件奖励显示
    View.prototype.refreshMailRewarksUI = function () {
        this.ui.btn_receive.active = false;
        this.ui.btn_del.active = false;
        var row = 0;
        var column = 0;
        if (this.model.mailExplain.bRec || this.model.mailExplain.reward.length == 0) {
            this.ui.btn_del.active = true;
            return;
        }
        for (var i = 0; i < this.model.mailExplain.reward.length; i++) {
            var rewarkData = this.model.mailExplain.reward[i];
            var rewarkNode = this.addPrefabNode(this.ui.mailRewark, this.ui.rewarks);
            row = i % 5;
            if (i != 0 && i % 5 == 0) {
                column++;
            }
            rewarkNode.x = -165 + 85 * row;
            rewarkNode.y = -85 * column;
            rewarkNode.getComponent("mailRewark").initMailRewark(rewarkData);
        }
        this.ui.btn_receive.active = !this.model.mailExplain.bRec;
        this.ui.btn_del.active = this.model.mailExplain.bRec;
    };
    //刷新点击邮件背景颜色   选择的邮件背景变黄色
    View.prototype.refreshMailBgColor = function () {
        for (var i = 0; i < this.model.mailsData.list.length; i++) {
            var mailData = this.model.mailsData.list[i];
            if (!mailData.id) {
                return;
            }
            if (mailData.id == this.model.mailExplain.id) {
                this.ui.mailsList.children[i].getChildByName("frameBg").color = cc.color(243, 255, 183);
            }
            else {
                this.ui.mailsList.children[i].getChildByName("frameBg").color = cc.color(255, 255, 255);
            }
        }
    };
    //领取邮件奖励
    View.prototype.bRecMailRewark = function () {
        this.delMailRewark();
        this.ui.btn_receive.active = !this.model.mailExplain.bRec;
        this.ui.btn_del.active = this.model.mailExplain.bRec;
    };
    //删除邮件奖励
    View.prototype.delMailRewark = function () {
        if (this.ui.rewarks.childrenCount == 0) {
            return;
        }
        for (var i = 0; i < this.ui.rewarks.childrenCount; i++) {
            var rewarkNode = this.ui.rewarks.children[i];
            if (rewarkNode) {
                rewarkNode.destroy();
            }
        }
    };
    //领取有奖宝箱处理
    View.prototype.showBoxes = function () {
        var _this = this;
        var index = 0;
        var fun = function () {
            var data = _this.model.boxesRewarkData[++index];
            if (data)
                ctrl.showBoxesRewark(data, fun);
        };
        ctrl.showBoxesRewark(this.model.boxesRewarkData[index], fun);
    };
    return View;
}(BaseView_1.default));
//c, 控制
var MailsCtrl = /** @class */ (function (_super) {
    __extends(MailsCtrl, _super);
    function MailsCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_close = null;
        _this.mailsList = null;
        _this.mail = null;
        _this.mailsExplain_title = null;
        _this.mailsExplain_name = null;
        _this.mailsExplain_content = null;
        _this.mailsCount = null;
        _this.mailRewark = null;
        _this.rewarkFrame = null;
        _this.btn_allReceive = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    MailsCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    MailsCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            "plaza.mail.recMail": this.recMail,
            "plaza.mail.delMail": this.delMail,
        };
    };
    //定义全局事件
    MailsCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {
            "refreshMailExplain": this.refreshMailExplain,
        };
    };
    //绑定操作的回调
    MailsCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_close, function () {
            _this.closeModule("mails");
        }, "关闭邮箱界面");
        this.connect("click", this.ui.btn_receive, function () {
            var idList = [];
            idList.push(_this.model.mailExplain.id);
            mailMgr_1.default.getInstance().sendReqMailRewark(idList);
        }, "\u9886\u53D6\u90AE\u4EF6\u5956\u52B1" + this.model.mailExplain.id);
        this.connect("click", this.ui.btn_allReceive, function () {
            var list = mailMgr_1.default.getInstance().getAllMailId();
            mailMgr_1.default.getInstance().sendReqMailRewark(list);
        }, "\u9886\u53D6\u5168\u90E8\u90AE\u4EF6\u5956\u52B1" + this.model.mailExplain.id);
        this.connect("click", this.ui.btn_del, function () {
            var idList = [];
            idList.push(_this.model.mailExplain.id);
            mailMgr_1.default.getInstance().sendReqMailDel(idList);
        }, "\u5220\u9664\u90AE\u4EF6" + this.model.mailExplain.id);
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    //刷新邮件详细内容显示
    MailsCtrl.prototype.refreshMailExplain = function (mailId) {
        this.model.setMailExplainData(mailId);
        this.view.refreshMailExplainUI();
    };
    //领取邮件  
    MailsCtrl.prototype.recMail = function () {
        if (mailMgr_1.default.getInstance().isAllMailRecRewark) { //全部领取
            //刷新全部邮件的ico  显示已读取状态
            this.view.refreshAllMailIco();
            if (this.model.mailExplain.id != null) { //有显示当前邮件详情
                //清除奖励数据，领取按钮变为删除按钮
                this.model.setMailExplainData(this.model.mailExplain.id);
                this.view.bRecMailRewark();
            }
        }
        else {
            this.model.setMailExplainData(this.model.mailExplain.id); //单个邮件领取
            this.view.bRecMailRewark();
        }
        //宝箱处理
        if (mailMgr_1.default.getInstance().boxesRewark != null) {
            this.model.setBoxesRewarkData();
            this.view.showBoxes();
        }
    };
    //删除邮件
    MailsCtrl.prototype.delMail = function () {
        this.model.mailExplain = {};
        this.view.initUi();
    };
    //显示宝箱奖励界面
    MailsCtrl.prototype.showBoxesRewark = function (arr, CB) {
        this.openSubModule("gainBox", true).then(function (script) {
            script.setGainData(arr, CB);
        });
    };
    MailsCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], MailsCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Node)
    ], MailsCtrl.prototype, "mailsList", void 0);
    __decorate([
        property(cc.Prefab)
    ], MailsCtrl.prototype, "mail", void 0);
    __decorate([
        property(cc.Label)
    ], MailsCtrl.prototype, "mailsExplain_title", void 0);
    __decorate([
        property(cc.Label)
    ], MailsCtrl.prototype, "mailsExplain_name", void 0);
    __decorate([
        property(cc.Label)
    ], MailsCtrl.prototype, "mailsExplain_content", void 0);
    __decorate([
        property(cc.Label)
    ], MailsCtrl.prototype, "mailsCount", void 0);
    __decorate([
        property(cc.Prefab)
    ], MailsCtrl.prototype, "mailRewark", void 0);
    __decorate([
        property(cc.Node)
    ], MailsCtrl.prototype, "rewarkFrame", void 0);
    __decorate([
        property(cc.Button)
    ], MailsCtrl.prototype, "btn_allReceive", void 0);
    MailsCtrl = __decorate([
        ccclass
    ], MailsCtrl);
    return MailsCtrl;
}(BaseCtrl_1.default));
exports.default = MailsCtrl;

cc._RF.pop();