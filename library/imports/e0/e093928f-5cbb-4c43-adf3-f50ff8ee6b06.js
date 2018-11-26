"use strict";
cc._RF.push(module, 'e0939KPXLtMQ63z9Q/47msG', 'roleMgr');
// manager/public/roleMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
var userMgr_1 = require("./userMgr");
var enums_1 = require("../enums");
/*
author: 陈斌杰
日期:2018-11-13 20:03:14
*/
var RoleMgr = /** @class */ (function (_super) {
    __extends(RoleMgr, _super);
    function RoleMgr() {
        var _this = _super.call(this) || this;
        _this.isFirst = false;
        _this.roleCfgTab = null; //角色配置表
        _this.rolesData = []; //角色数据
        _this.choiceRole = null; //当前选择的角色数据
        _this.routes = {
            "plaza.role.reqRoleList": _this.reqRoleList,
            "plaza.role.unlockRole": _this.unlockRole,
            "plaza.role.switchRole": _this.switchRole,
        };
        return _this;
    }
    RoleMgr.getInstance = function () {
        if (RoleMgr._instance == null) {
            RoleMgr._instance = new RoleMgr();
        }
        return RoleMgr._instance;
    };
    //向服务器发送角色列表数据请求
    RoleMgr.prototype.sendReqRoleListData = function () {
        this.isFirst = true;
        this.send_msg("plaza.role.reqRoleList");
    };
    //获取服务器发送的角色列表数据
    RoleMgr.prototype.reqRoleList = function (msg) {
        var data = msg.getDataByType(dataids_1.dataids.ID_ROLELIST);
        this.getCfgTab();
        this.initRolesData();
        this.setRolesData(data);
        this.setUsingRoleData();
    };
    //向服务器发送解锁角色请求
    RoleMgr.prototype.sendReqUnlockRole = function (roleId) {
        var msg = {
            itemId: roleId,
        };
        this.send_msg("plaza.role.unlockRole", msg);
    };
    //获取服务器发送的角色解锁数据
    RoleMgr.prototype.unlockRole = function (msg) {
        var itemData = msg.getDataByType(dataids_1.dataids.ID_ITEM_COUNT); //碎片解锁需要  设置玩家数据
        var unlockRoleData = msg.getDataByType(dataids_1.dataids.ID_UNLOCK_ROLE);
        this.setRolesData(unlockRoleData);
    };
    //向服务器发送角色使用请求
    RoleMgr.prototype.sendReqUsingRole = function (roleId) {
        var msg = {
            autoId: roleId,
        };
        this.send_msg("plaza.role.switchRole", msg);
    };
    //获取服务器发送的角色使用数据
    RoleMgr.prototype.switchRole = function (msg) {
        var itemData = msg.getDataByType(dataids_1.dataids.ID_EQUIP_ROLE);
        this.setRoleUsingData(itemData.autoId);
        this.setUsingRoleData();
    };
    //获取角色配置表
    RoleMgr.prototype.getCfgTab = function () {
        this.roleCfgTab = this.getConfigSync("role_juese").json;
    };
    //初始化角色数据
    RoleMgr.prototype.initRolesData = function () {
        //初始原始数据
        for (var i = 0; i < this.roleCfgTab.length + 1; i++) {
            var roleData = {};
            var roleCfgData = this.roleCfgTab[i];
            if (i == this.roleCfgTab.length) {
                roleData.roleId = null;
                return;
            }
            roleData.id = null;
            roleData.roleId = roleCfgData.roleId;
            roleData.isUnlock = false;
            roleData.isUsing = false;
            if (roleCfgData.unlock_chip != null) {
                roleData.itemId = roleCfgData.unlock_chip[0].itemid;
                roleData.roleChipNum = roleCfgData.unlock_chip[0].count;
            }
            else {
                roleData.itemId = null;
                roleData.roleChipNum = 0;
            }
            roleData.userRoleChipNum = 0;
            roleData.spendGold = roleCfgData.unlock_gold || 0;
            roleData.spendCrystal = roleCfgData.unlock_crystal || 0;
            roleData.spendDiamond = roleCfgData.unlock_diamond || 0;
            roleData.vipLimite = roleCfgData.unlock_vip || 0;
            this.rolesData.push(roleData);
        }
    };
    //设置角色数据
    RoleMgr.prototype.setRolesData = function (data) {
        if (!data) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < this.rolesData.length; j++) {
                if (data[i].itemId == this.rolesData[j].roleId) {
                    var roleData = this.getRoleCfgDataByItem(data[i].itemId);
                    this.rolesData[j].id = data[i].id;
                    this.rolesData[j].roleId = data[i].itemId;
                    this.rolesData[j].isUnlock = true;
                    if (roleData.unlock_chip != null) {
                        this.rolesData[j].itemId = roleData.unlock_chip[0].itemid;
                        this.rolesData[j].roleChipNum = roleData.unlock_chip[0].count;
                    }
                    this.rolesData[j].userRoleChipNum = 0;
                    this.rolesData[j].spendGold = roleData.unlock_gold;
                    this.rolesData[j].spendCrystal = roleData.unlock_crystal;
                    this.rolesData[j].spendDiamond = roleData.unlock_diamond;
                    this.rolesData[j].vipLimite = roleData.unlock_vip;
                }
            }
        }
    };
    //设置当前使用的角色数据
    RoleMgr.prototype.setUsingRoleData = function () {
        for (var i = 0; i < this.rolesData.length; i++) {
            var roleId = userMgr_1.default.getInstance().user.roleId;
            if (roleId == this.rolesData[i].id) {
                this.choiceRole = this.rolesData[i];
                this.choiceRole.id = roleId;
                this.choiceRole.isUsing = true;
                break;
            }
        }
    };
    //设置当前的角色为使用角色
    RoleMgr.prototype.setRoleUsingData = function (roleId) {
        for (var i = 0; i < this.rolesData.length; i++) {
            var role_1 = this.rolesData[i];
            if (role_1.id == roleId) {
                role_1.isUsing = true;
            }
            else {
                role_1.isUsing = false;
            }
        }
    };
    //根据itemid获取配置表中角色数据
    RoleMgr.prototype.getRoleCfgDataByItem = function (itemId) {
        for (var i = 0; i < this.roleCfgTab.length; i++) {
            var rolefata = this.roleCfgTab[i];
            if (itemId == rolefata.roleId) {
                return rolefata;
            }
        }
    };
    //根据itemid获取角色数据
    RoleMgr.prototype.getRoleDataByItem = function (itemId) {
        for (var i = 0; i < this.rolesData.length; i++) {
            var rolefata = this.rolesData[i];
            if (itemId == rolefata.roleId) {
                return rolefata;
            }
        }
    };
    //领取邮件奖励获得的特技数据处理
    RoleMgr.prototype.refreshData = function (data) {
        if (!this.rolesData || this.rolesData.length == 0) {
            return;
        }
        for (var key in data) {
            if (Number(key) == enums_1.enums.Get_Chip) {
                for (var i = 0; i < data[key].length; i++) {
                    for (var j = 0; j < this.rolesData.length; j++) {
                        var roleData = this.rolesData[j];
                        if (data[key][i].itemId == roleData.itemId) {
                            roleData.userRoleChipNum += data[key][i].amount;
                            break;
                        }
                    }
                }
            }
        }
    };
    // 单例处理
    RoleMgr._instance = null;
    return RoleMgr;
}(BaseMgr_1.default));
exports.default = RoleMgr;

cc._RF.pop();