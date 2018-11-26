"use strict";
cc._RF.push(module, '09deeNuBsdOgoMfl/NtzX4S', 'effectMgr');
// manager/public/effectMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
var userMgr_1 = require("./userMgr");
var enums_1 = require("../enums");
/*
author: 陈斌杰
日期:2018-11-07 21:02:39
*/
var EffectMgr = /** @class */ (function (_super) {
    __extends(EffectMgr, _super);
    function EffectMgr() {
        var _this = _super.call(this) || this;
        _this.isInit = false;
        _this.levelCfgTab = null; //等级配置表
        _this.effectCfgTab = null; //特技配置表
        _this.effectCfgUpTab = null; //特技升级配置表
        _this.ballCfgUpTab = null; //炮弹配置表
        _this.buffCfgUpTab = null; //buff配置表
        _this.effectList = {}; //特技数据
        _this.effectCfgList = {}; //特技栏数据
        _this.effectNum = 0; //当前装备特技的数量
        _this.allEffectNum = 2; //当前可以装备特技的总数量
        _this.interimCfg = []; //临时特技配置id数组
        _this.effectUnlockNum = 0; //解锁的特技数量
        _this.routes = {
            "plaza.teji.reqTejiInfo": _this.reqTejiInfo,
            "plaza.teji.tejiLvUp": _this.tejiLvUp,
            "plaza.teji.equipTeji": _this.equipTeji,
        };
        return _this;
    }
    EffectMgr.getInstance = function () {
        if (EffectMgr._instance == null) {
            EffectMgr._instance = new EffectMgr();
        }
        return EffectMgr._instance;
    };
    //向服务器发送特技请求
    EffectMgr.prototype.sendReqEffectData = function () {
        this.send_msg("plaza.teji.reqTejiInfo");
    };
    //获取服务器发送的特技数据
    EffectMgr.prototype.reqTejiInfo = function (msg) {
        this.isInit = true;
        var data = msg.getDataByType(dataids_1.dataids.ID_TEJI_INFO);
        this.getEffectCfgTab();
        this.initEffectData();
        this.setEffectData(data);
        this.initEffectCfgList(data);
    };
    //向服务器发送升级特技请求
    EffectMgr.prototype.sendReqUpEffect = function (autoId) {
        var msg = {
            autoId: autoId,
        };
        this.send_msg("plaza.teji.tejiLvUp", msg);
    };
    //获取服务器发送的特技升级数据
    EffectMgr.prototype.tejiLvUp = function (msg) {
        var effectInfo = msg.getDataByType(dataids_1.dataids.ID_TEJI_LEVELUP);
        this.upEffectData(effectInfo);
        this.gemit("upEffect");
    };
    //向服务器发送保存的配置数据
    EffectMgr.prototype.sendReqEffectCfgData = function (data) {
        var msg = {
            listEquip: data,
        };
        this.send_msg("plaza.teji.equipTeji", msg);
    };
    //获取服务器发送的特技配置数据
    EffectMgr.prototype.equipTeji = function (msg) {
        var effectInfo = msg.getDataByType(dataids_1.dataids.ID_TEJI_EQUIP);
        this.seteffectCfgListData(effectInfo);
        this.gemit("effectCfg");
    };
    //获取特技所需配置表
    EffectMgr.prototype.getEffectCfgTab = function () {
        this.levelCfgTab = this.getConfigSync("level_dengji").json;
        this.effectCfgTab = this.getConfigSync("teji_teji").json;
        this.effectCfgUpTab = this.getConfigSync("tejiup_tejiup").json;
        this.ballCfgUpTab = this.getConfigSync("ball_ball").json;
        this.buffCfgUpTab = this.getConfigSync("buff_buff").json;
    };
    //初始化特技数据
    EffectMgr.prototype.initEffectData = function () {
        this.effectList.list = [];
        for (var i = 0; i < this.effectCfgTab.length; i++) {
            var effectData = this.effectCfgTab[i]; //默认使用初始特技数据
            var effectUpData = this.effectCfgUpTab[0]; //默认初始为最低等级升级数据
            var effect_1 = {};
            effect_1.name = effectData.name;
            effect_1.type = effectData.type;
            effect_1.explain = effectData.des;
            effect_1.id = null;
            effect_1.itemId = effectData.id;
            effect_1.lv = effectUpData.level;
            effect_1.star = effectData.star;
            effect_1.damage = 0;
            if (effectData.ball_id) {
                effect_1.damage = this.getEffectDamage(effectData.ball_id, this.ballCfgUpTab);
            }
            else if (effectData.buff_id) {
                effect_1.damage = this.getEffectDamage(effectData.buff_id, this.buffCfgUpTab);
            }
            effect_1.energy = effectData.energy;
            effect_1.effectOther = {
                effectChipNum: 0,
                upEffectChipNmu: effectUpData.card,
                isUnlock: false,
                isConfig: false,
                nextLvDamage: null,
                getExp: effectUpData.exp[0].exp,
                spendGold: effectUpData.gold[0].gold,
            };
            this.effectList.list.push(effect_1);
        }
    };
    //设置特技初始数据
    EffectMgr.prototype.setEffectData = function (data) {
        if (data.length == 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < this.effectList.list.length; j++) {
                var effect_2 = this.effectList.list[j];
                if (data[i].itemId == effect_2.itemId) {
                    effect_2.effectOther.isUnlock = true;
                    this.effectUnlockNum++;
                    effect_2.effectOther.effectChipNum = data[i].amount;
                    if (data[i].bEquiped == 0) {
                        effect_2.effectOther.isConfig = false;
                    }
                    else {
                        effect_2.effectOther.isConfig = true;
                    }
                    effect_2.id = data[i].id;
                    effect_2.lv = data[i].maxLevel;
                    //解锁的特接排前面
                    var str = this.effectList.list.splice(j, 1);
                    this.effectList.list.unshift(str[0]);
                    break;
                }
            }
        }
    };
    //设置特技伤害数据
    EffectMgr.prototype.getEffectDamage = function (id, configTab) {
        var damage = 0;
        for (var i = 0; i < configTab.length; i++) {
            if (id == configTab[i].ball_id || id == configTab[i].buff_id) {
                if (configTab[i].damage) {
                    damage = configTab[i].damage[0].dmg;
                }
            }
        }
        return damage;
    };
    //初始化特技配置列表
    EffectMgr.prototype.initEffectCfgList = function (data) {
        for (var i = 0; i < this.levelCfgTab.length; i++) {
            var lv = userMgr_1.default.getInstance().user.grade;
            if (lv == this.levelCfgTab[i].level) {
                this.allEffectNum = this.levelCfgTab[i].maxTejiEquipNum; //初始化特技可装备的数量
            }
        }
        if (this.effectCfgList.list) {
            return;
        }
        this.effectCfgList.list = []; //初始特技配置栏
        for (var i = 0; i < this.allEffectNum; i++) {
            var effectCfg_1 = {};
            effectCfg_1.effectId = 0;
            effectCfg_1.isConfig = false;
            this.effectCfgList.list.push(effectCfg_1);
        }
        if (data.length == 0) {
            return;
        }
        // for (let i = 0; i < data.length;) {
        // 	if (data[i].bEquiped == 0) {
        // 		data.splice(i, 1);
        // 	} else {
        // 		i++;
        // 	}
        // }
        for (var i = 0; i < this.effectCfgList.list.length; i++) { //设置特技配置栏数据
            if (!data[i]) {
                break;
            }
            if (data[i].bEquiped == 1) {
                this.effectCfgList.list[i].isConfig = true;
                this.effectCfgList.list[i].effectId = data[i].itemId;
            }
        }
    };
    //根据特技Id特技数据
    EffectMgr.prototype.getEffectDataById = function (id) {
        if (id == 0) {
            return;
        }
        for (var i = 0; i < this.effectList.list.length; i++) {
            var data = this.effectList.list[i];
            if (id == data.itemId) {
                return data;
            }
        }
    };
    //设置当前装备的特技数量
    EffectMgr.prototype.setEffectNum = function (num) {
        this.effectNum = num;
    };
    //特技数据排序  星级	sort: -1 小到大、1 大到小
    EffectMgr.prototype.sortEffectData = function (sort) {
        var str = this.effectList.list.splice(this.effectUnlockNum, this.effectList.list.length - this.effectUnlockNum);
        this.effectList.list.sort(function (a, b) {
            if (a.star < b.star) {
                return sort;
            }
            else if (a.star > b.star) {
                return -sort;
            }
            else {
                return 0;
            }
        });
        for (var i = 0; i < str.length; i++) {
            this.effectList.list.push(str[i]);
        }
    };
    //升级特技数据操作
    EffectMgr.prototype.upEffectData = function (data) {
        for (var i = 0; i < this.effectList.list.length; i++) {
            var effectData = this.effectList.list[i];
            if (effectData.id == data.autoId) {
                effectData.lv = data.tejiLv; //设置特技等级
                effectData.effectOther.effectChipNum = data.tejiNum; //设置特技持有碎片数量
                effectData.damage = this.setEffectDamage(effectData.itemId, effectData.lv); //设置特技伤害
                this.setEffectUpCfg(effectData, data);
            }
        }
    };
    EffectMgr.prototype.setEffectUpCfg = function (effectData, data) {
        for (var i = 0; i < this.effectCfgUpTab.length; i++) {
            var config = this.effectCfgUpTab[i];
            if (data.tejiLv == config.level) {
                effectData.effectOther.upEffectChipNmu = config.card; //设置特技升级需要的数量
                for (var j = 0; j < config.gold.length; j++) {
                    if (effectData.star == config.gold[j].star) {
                        effectData.effectOther.spendGold = config.gold[j].gold; //设置升级花费的金币
                    }
                }
                for (var j = 0; j < config.exp.length; j++) {
                    if (effectData.star == config.exp[j].star) {
                        effectData.effectOther.getExp = config.exp[j].exp; //设置升级得到的经验
                    }
                }
            }
        }
    };
    EffectMgr.prototype.setEffectDamage = function (effectId, lv) {
        var id = null;
        for (var i = 0; i < this.effectCfgTab.length; i++) {
            if (this.effectCfgTab[i].id == effectId) {
                if (this.effectCfgTab[i].ball_id) {
                    id = this.effectCfgTab[i].ball_id;
                }
                else if (this.effectCfgTab[i].buff_id) {
                    id = this.effectCfgTab[i].buff_id;
                }
            }
        }
        var effectDamage = 0;
        for (var i = 0; i < this.ballCfgUpTab.length; i++) {
            if (id == this.ballCfgUpTab[i].ball_id && this.ballCfgUpTab[i].damage) {
                for (var j = 0; j < this.ballCfgUpTab[i].damage.length; j++) {
                    if (this.ballCfgUpTab[i].damage[j].level == lv) {
                        effectDamage = this.ballCfgUpTab[i].damage[j].dmg;
                        break;
                    }
                }
            }
        }
        for (var i = 0; i < this.buffCfgUpTab.length; i++) {
            if (id == this.buffCfgUpTab[i].buff_id && this.buffCfgUpTab[i].damage) {
                for (var j = 0; j < this.buffCfgUpTab[i].damage.length; j++) {
                    if (this.buffCfgUpTab[i].damage[j].level == lv) {
                        effectDamage = this.buffCfgUpTab[i].damage[j].dmg;
                        break;
                    }
                }
            }
        }
        return effectDamage;
    };
    //保存特技配置操作
    EffectMgr.prototype.seteffectCfgListData = function (data) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < this.effectList.list.length; j++) {
                var effect_3 = this.effectList.list[j];
                if (effect_3.id == data[i]) {
                    this.effectCfgList.list[i].effectId = effect_3.itemId;
                    this.effectCfgList.list[i].isConfig = true;
                    break;
                }
            }
        }
        this.interimCfg = [];
    };
    //领取邮件奖励获得的特技数据处理
    EffectMgr.prototype.refreshData = function (data) {
        if (!this.effectList.list) {
            return;
        }
        for (var key in data) {
            if (Number(key) == enums_1.enums.Get_Skill) {
                for (var i = 0; i < data[key].length; i++) {
                    var skillData = data[key][i];
                    for (var j = 0; j < this.effectList.list.length; j++) {
                        var effectData = this.effectList.list[j];
                        if (skillData.itemId == effectData.itemId) {
                            effectData.effectOther.effectChipNum += skillData.amount;
                            break;
                        }
                    }
                }
            }
        }
    };
    EffectMgr.prototype.addEffect = function (data) {
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            for (var j = 0; j < this.effectList.list.length; j++) {
                var effect_obj = this.effectList.list[i];
                if (obj.itemId == effect_obj.itemId) {
                    effect_obj.effectOther.effectChipNum += obj.amount;
                    break;
                }
            }
        }
    };
    EffectMgr.prototype.getAllTypeItem = function (data) {
        console.log(data);
        if (data[enums_1.enums.Get_Skill]) {
            this.addEffect(data[enums_1.enums.Get_Skill]);
        }
    };
    // 单例处理
    EffectMgr._instance = null;
    return EffectMgr;
}(BaseMgr_1.default));
exports.default = EffectMgr;

cc._RF.pop();