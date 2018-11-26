(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/manager/public/mailMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '13a034LFMdLMpUM4HHTvYAp', 'mailMgr', __filename);
// manager/public/mailMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
/*
author: 陈斌杰
日期:2018-11-16 16:40:35
*/
var MailMgr = /** @class */ (function (_super) {
    __extends(MailMgr, _super);
    function MailMgr() {
        var _this = _super.call(this) || this;
        _this.isFrist = false; //是否是第一次打开
        _this.mailsData = {}; //全部邮件数据
        _this.mailCount = 0; //邮件数量
        _this.isAllMailRecRewark = false; //是否全部领取
        _this.boxesRewark = null; //邮件宝箱数据
        _this.routes = {
            "plaza.mail.reqMailList": _this.reqMailList,
            "plaza.mail.readMail": _this.readMail,
            "plaza.mail.recMail": _this.recMail,
            "plaza.mail.delMail": _this.delMail,
            "onNewMail": _this.onNewMail,
        };
        return _this;
    }
    MailMgr.getInstance = function () {
        if (MailMgr._instance == null) {
            MailMgr._instance = new MailMgr();
        }
        return MailMgr._instance;
    };
    //向服务器请求邮件数据
    MailMgr.prototype.sendReqMailsData = function () {
        this.send_msg("plaza.mail.reqMailList");
    };
    //获取服务器下发的邮件数据
    MailMgr.prototype.reqMailList = function (msg) {
        var mailsData = msg.getDataByType(dataids_1.dataids.ID_GET_MAILS);
        this.isFrist = true;
        this.initMailsData();
        this.setMailsData(mailsData);
    };
    //向服务器请求邮件详细数据
    MailMgr.prototype.sendReqMailExplainData = function (idList) {
        var msg = {
            listAutoId: idList,
        };
        this.send_msg("plaza.mail.readMail", msg);
    };
    //获取服务器下发的邮件详细数据
    MailMgr.prototype.readMail = function (msg) {
        var mailData = msg.getDataByType(dataids_1.dataids.ID_READ_MAIL);
        this.setReadMailData(mailData);
        this.gemit("refreshMailExplain", mailData[0].id);
    };
    //向服务器发送领取邮件物品请求
    MailMgr.prototype.sendReqMailRewark = function (idList) {
        var msg = {
            listAutoId: idList,
        };
        this.send_msg("plaza.mail.recMail", msg);
    };
    //获取服务器下发的邮件奖励数据
    MailMgr.prototype.recMail = function (msg) {
        var data = msg.getDataByType(dataids_1.dataids.ID_GET_MAILITEMS);
        this.setMailBRecData(data.listAutoId);
        //有宝箱要特殊处理
        var boxesData = msg.getDataByType(dataids_1.dataids.ID_GET_BOXPRIZE);
        this.setBoxesData(boxesData);
    };
    //向服务器发送删除邮件请求
    MailMgr.prototype.sendReqMailDel = function (idList) {
        var msg = {
            listAutoId: idList,
        };
        this.send_msg("plaza.mail.delMail", msg);
    };
    //获取服务器下发的删除邮件数据
    MailMgr.prototype.delMail = function (msg) {
        var data = msg.getDataByType(dataids_1.dataids.ID_DEL_MAIL);
        this.delMailData(data);
    };
    //新邮件数据
    MailMgr.prototype.onNewMail = function (msg) {
        var mailsData = msg.getDataByType(dataids_1.dataids.ID_NEW_MAIL);
        console.log("--------新邮件数据-------", mailsData);
        if (!this.isFrist) {
            this.initMailsData();
        }
        this.setMailsData(mailsData);
    };
    //初始化邮箱数据
    MailMgr.prototype.initMailsData = function () {
        this.mailsData.list = [];
        for (var i = 0; i < 100; i++) {
            var mail_1 = {};
            mail_1.id = null;
            mail_1.bReaded = false;
            mail_1.bRec = false;
            mail_1.title = null;
            mail_1.sendTime = null;
            mail_1.residueTime = null;
            mail_1.content = null;
            mail_1.reward = [];
            this.mailsData.list.push(mail_1);
        }
    };
    //设置邮箱数据
    MailMgr.prototype.setMailsData = function (data) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < this.mailsData.list.length; j++) {
                var mailData = this.mailsData.list[j];
                if (mailData.id) {
                    var mail_2 = {};
                    mail_2.id = data[i].id;
                    if (data[i].bReaded == 1) {
                        mail_2.bReaded = true;
                    }
                    else {
                        mail_2.bReaded = false;
                    }
                    if (data[i].bRec == 1) {
                        mail_2.bRec = true;
                    }
                    else {
                        mail_2.bRec = false;
                    }
                    mail_2.title = data[i].title;
                    mail_2.sendTime = this.changeTimeStamp(data[i].createTime);
                    mail_2.residueTime = this.getRemainingTiem(data[i].createTime);
                    ;
                    this.mailsData.list.splice(-1, 1); //删除最后一个空数据  在第一个位置添加新数据
                    this.mailsData.list.splice(0, 0, mail_2);
                }
                else {
                    mailData.id = data[i].id;
                    if (data[i].bReaded == 1) {
                        mailData.bReaded = true;
                    }
                    if (data[i].bRec == 1) {
                        mailData.bRec = true;
                    }
                    mailData.title = data[i].title;
                    mailData.sendTime = this.changeTimeStamp(data[i].createTime);
                    mailData.residueTime = this.getRemainingTiem(data[i].createTime);
                }
                break;
            }
        }
        this.mailCount += data.length;
    };
    //设置邮件的读取数据
    MailMgr.prototype.setReadMailData = function (data) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < this.mailsData.list.length; j++) {
                var mailData = this.mailsData.list[j];
                if (data[i].id == mailData.id) {
                    mailData.bReaded = true;
                    mailData.content = data[i].content;
                    mailData.reward = [];
                    for (var k = 0; k < data[i].recItems.length; k++) {
                        if (!data[i].recItems[k].type || !data[i].recItems[k].amount || !data[i].recItems[k].itemId) {
                            break;
                        }
                        var mail_rewark_1 = {};
                        mail_rewark_1.type = data[i].recItems[k].type;
                        mail_rewark_1.amount = data[i].recItems[k].amount;
                        mail_rewark_1.itemId = data[i].recItems[k].itemId;
                        mailData.reward.push(mail_rewark_1);
                    }
                    break;
                }
            }
        }
    };
    //设置邮件的领取数据
    MailMgr.prototype.setMailBRecData = function (data) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < this.mailsData.list.length; j++) {
                var mailData = this.mailsData.list[j];
                if (data[i] == mailData.id) {
                    mailData.bReaded = true;
                    mailData.bRec = true;
                    mailData.reward = [];
                }
            }
        }
        if (data.length > 1) {
            this.isAllMailRecRewark = true;
        }
        else {
            this.isAllMailRecRewark = false;
        }
    };
    //设置宝箱数据
    MailMgr.prototype.setBoxesData = function (data) {
        if (data == null) {
            return;
        }
        this.boxesRewark = data;
    };
    //删除邮件数据
    MailMgr.prototype.delMailData = function (data) {
        for (var i = 0; i < data.length; i++) {
            var delId = data[i];
            for (var j = 0; j < this.mailsData.list.length; j++) {
                var mailData = this.mailsData.list[j];
                if (delId == mailData.id) {
                    this.mailsData.list.splice(j, 1);
                    var mail_3 = {};
                    mail_3.id = null;
                    mail_3.bReaded = false;
                    mail_3.bRec = false;
                    mail_3.title = null;
                    mail_3.sendTime = null;
                    mail_3.residueTime = null;
                    mail_3.content = null;
                    mail_3.reward = [];
                    this.mailsData.list.push(mail_3);
                    break;
                }
            }
        }
        this.mailCount -= data.length;
    };
    //新增邮件时刷新邮件数据
    MailMgr.prototype.refreshMailsData = function (data) {
    };
    //获取全部邮件id
    MailMgr.prototype.getAllMailId = function () {
        var list = [];
        for (var i = 0; i < this.mailsData.list.length; i++) {
            var mailData = this.mailsData.list[i];
            if (mailData.id) {
                list.push(mailData.id);
            }
            else {
                break;
            }
        }
        return list;
    };
    //时间戳转换
    MailMgr.prototype.changeTimeStamp = function (time) {
        var date = new Date(time);
        var y = date.getFullYear().toString();
        var m = (date.getMonth() + 1).toString();
        var d = date.getDate().toString();
        return y + '-' + m + '-' + d;
    };
    //获取剩余天数
    MailMgr.prototype.getRemainingTiem = function (time) {
        var nowTime = new Date().getTime(); //当前时间戳
        var spendTiem = (nowTime - time) / 1000; //花费的秒数
        var allTime = 30 * 24 * 3600; //总的30天秒数		
        var remainingTime = (allTime - spendTiem) / 24 / 3600;
        return Math.floor(remainingTime) + 1;
    };
    // 单例处理
    MailMgr._instance = null;
    return MailMgr;
}(BaseMgr_1.default));
exports.default = MailMgr;

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
        //# sourceMappingURL=mailMgr.js.map
        