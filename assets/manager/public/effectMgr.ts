import BaseMgr from "../../framework/baseClass/BaseMgr";
import { effectList, effectCfgList, effect, effectCfg } from "./interface/iEffect";
import GameNet from "../../framework/modules/GameNet";
import Package from "../../framework/net/package";
import { dataids } from "../../framework/net/dataids";
import UserMgr from "./userMgr";
import { enums } from "../enums";

/*
author: 陈斌杰
日期:2018-11-07 21:02:39
*/

export default class EffectMgr extends BaseMgr {
	public isInit: boolean = false;
	public levelCfgTab: any = null;								//等级配置表
	public effectCfgTab: any = null;							//特技配置表
	public effectCfgUpTab: any = null;							//特技升级配置表
	public ballCfgUpTab: any = null;							//炮弹配置表
	public buffCfgUpTab: any = null;							//buff配置表
	public effectList: effectList = <effectList>{};				//特技数据
	public effectCfgList: effectCfgList = <effectCfgList>{};	//特技栏数据
	public effectNum: number = 0;								//当前装备特技的数量
	public allEffectNum: number = 2;							//当前可以装备特技的总数量
	public interimCfg: number[] = [];							//临时特技配置id数组
	public effectUnlockNum: number = 0;							//解锁的特技数量
	constructor() {
		super();
		this.routes = {
			"plaza.teji.reqTejiInfo": this.reqTejiInfo,
			"plaza.teji.tejiLvUp": this.tejiLvUp,
			"plaza.teji.equipTeji": this.equipTeji,
		};
	}

	// 单例处理
	private static _instance: EffectMgr = null;
	public static getInstance(): EffectMgr {
		if (EffectMgr._instance == null) {
			EffectMgr._instance = new EffectMgr();
		}
		return EffectMgr._instance;
	}

	//向服务器发送特技请求
	public sendReqEffectData(): void {
		this.send_msg("plaza.teji.reqTejiInfo");
	}

	//获取服务器发送的特技数据
	public reqTejiInfo(msg: Package): void {
		this.isInit = true;
		let data = msg.getDataByType(dataids.ID_TEJI_INFO);
		this.getEffectCfgTab();
		this.initEffectData();
		this.setEffectData(data);
		this.initEffectCfgList(data);
	}

	//向服务器发送升级特技请求
	public sendReqUpEffect(autoId: number): void {
		let msg = {
			autoId: autoId,
		}
		this.send_msg("plaza.teji.tejiLvUp", msg);
	}

	//获取服务器发送的特技升级数据
	public tejiLvUp(msg: Package): void {
		let effectInfo = msg.getDataByType(dataids.ID_TEJI_LEVELUP);
		this.upEffectData(effectInfo);
		this.gemit("upEffect");
	}

	//向服务器发送保存的配置数据
	public sendReqEffectCfgData(data: any): void {
		let msg = {
			listEquip: data,
		}
		this.send_msg("plaza.teji.equipTeji", msg);
	}

	//获取服务器发送的特技配置数据
	public equipTeji(msg: Package): void {
		let effectInfo = msg.getDataByType(dataids.ID_TEJI_EQUIP);
		this.seteffectCfgListData(effectInfo);
		this.gemit("effectCfg");
	}

	//获取特技所需配置表
	public getEffectCfgTab(): void {
		this.levelCfgTab = this.getConfigSync("level_dengji").json;
		this.effectCfgTab = this.getConfigSync("teji_teji").json;
		this.effectCfgUpTab = this.getConfigSync("tejiup_tejiup").json;
		this.ballCfgUpTab = this.getConfigSync("ball_ball").json;
		this.buffCfgUpTab = this.getConfigSync("buff_buff").json;
	}

	//初始化特技数据
	public initEffectData(): void {
		this.effectList.list = [];
		for (let i = 0; i < this.effectCfgTab.length; i++) {
			let effectData = this.effectCfgTab[i];						//默认使用初始特技数据
			let effectUpData = this.effectCfgUpTab[0];					//默认初始为最低等级升级数据
			let effect: effect = <effect>{};
			effect.name = effectData.name;
			effect.type = effectData.type;
			effect.explain = effectData.des;
			effect.id = null;
			effect.itemId = effectData.id;
			effect.lv = effectUpData.level;
			effect.star = effectData.star;
			effect.damage = 0;
			if (effectData.ball_id) {
				effect.damage = this.getEffectDamage(effectData.ball_id, this.ballCfgUpTab);
			} else if (effectData.buff_id) {
				effect.damage = this.getEffectDamage(effectData.buff_id, this.buffCfgUpTab);
			}
			effect.energy = effectData.energy;
			effect.effectOther = {
				effectChipNum: 0,					//默认初始为0
				upEffectChipNmu: effectUpData.card,
				isUnlock: false,					//默认未解锁
				isConfig: false,					//默认为装备
				nextLvDamage: null,
				getExp: effectUpData.exp[0].exp,
				spendGold: effectUpData.gold[0].gold,
			};
			this.effectList.list.push(effect);
		}
	}

	//设置特技初始数据
	public setEffectData(data: any): void {
		if (data.length == 0) {
			return;
		}
		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < this.effectList.list.length; j++) {
				let effect: any = this.effectList.list[j];
				if (data[i].itemId == effect.itemId) {
					effect.effectOther.isUnlock = true;
					this.effectUnlockNum++;
					effect.effectOther.effectChipNum = data[i].amount;
					if (data[i].bEquiped == 0) {
						effect.effectOther.isConfig = false;
					} else {
						effect.effectOther.isConfig = true;
					}
					effect.id = data[i].id;
					effect.lv = data[i].maxLevel;

					//解锁的特接排前面
					var str = this.effectList.list.splice(j, 1);
					this.effectList.list.unshift(str[0]);
					break;
				}
			}
		}
	}

	//设置特技伤害数据
	public getEffectDamage(id: number, configTab: any): number {
		let damage: number = 0;
		for (let i = 0; i < configTab.length; i++) {
			if (id == configTab[i].ball_id || id == configTab[i].buff_id) {
				if (configTab[i].damage) {
					damage = configTab[i].damage[0].dmg;
				}
			}
		}
		return damage;
	}

	//初始化特技配置列表
	public initEffectCfgList(data: any): void {
		for (let i = 0; i < this.levelCfgTab.length; i++) {
			let lv = UserMgr.getInstance().user.grade;
			if (lv == this.levelCfgTab[i].level) {
				this.allEffectNum = this.levelCfgTab[i].maxTejiEquipNum;	//初始化特技可装备的数量
			}
		}

		if (this.effectCfgList.list) {
			return;
		}

		this.effectCfgList.list = [];										//初始特技配置栏
		for (let i = 0; i < this.allEffectNum; i++) {
			let effectCfg: effectCfg = <effectCfg>{};
			effectCfg.effectId = 0;
			effectCfg.isConfig = false;
			this.effectCfgList.list.push(effectCfg);
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
		for (let i = 0; i < this.effectCfgList.list.length; i++) {			//设置特技配置栏数据
			if (!data[i]) {
				break;
			}
			if (data[i].bEquiped == 1) {
				this.effectCfgList.list[i].isConfig = true;
				this.effectCfgList.list[i].effectId = data[i].itemId;
			}
		}
	}

	//根据特技Id特技数据
	public getEffectDataById(id: number): effect {
		if (id == 0) { return }
		for (let i = 0; i < this.effectList.list.length; i++) {
			let data = this.effectList.list[i];
			if (id == data.itemId) {
				return data;
			}
		}
	}

	//设置当前装备的特技数量
	public setEffectNum(num: number): void {
		this.effectNum = num;
	}

	//特技数据排序  星级	sort: -1 小到大、1 大到小
	public sortEffectData(sort: number): void {
		var str = this.effectList.list.splice(this.effectUnlockNum, this.effectList.list.length - this.effectUnlockNum);
		this.effectList.list.sort((a, b) => {
			if (a.star < b.star) {
				return sort;
			} else if (a.star > b.star) {
				return -sort;
			} else {
				return 0;
			}
		});
		for (let i = 0; i < str.length; i++) {
			this.effectList.list.push(str[i]);
		}
	}

	//升级特技数据操作
	public upEffectData(data: any): void {
		for (let i = 0; i < this.effectList.list.length; i++) {
			let effectData = this.effectList.list[i];
			if (effectData.id == data.autoId) {
				effectData.lv = data.tejiLv;									//设置特技等级
				effectData.effectOther.effectChipNum = data.tejiNum;			//设置特技持有碎片数量
				effectData.damage = this.setEffectDamage(effectData.itemId, effectData.lv);			//设置特技伤害
				this.setEffectUpCfg(effectData, data);
			}
		}
	}

	public setEffectUpCfg(effectData: any, data: any): void {
		for (let i = 0; i < this.effectCfgUpTab.length; i++) {
			let config = this.effectCfgUpTab[i];
			if (data.tejiLv == config.level) {
				effectData.effectOther.upEffectChipNmu = config.card;			//设置特技升级需要的数量
				for (let j = 0; j < config.gold.length; j++) {
					if (effectData.star == config.gold[j].star) {
						effectData.effectOther.spendGold = config.gold[j].gold;	//设置升级花费的金币
					}
				}
				for (let j = 0; j < config.exp.length; j++) {
					if (effectData.star == config.exp[j].star) {
						effectData.effectOther.getExp = config.exp[j].exp;		//设置升级得到的经验
					}
				}
			}
		}
	}

	public setEffectDamage(effectId: number, lv: number): number {
		let id = null;
		for (let i = 0; i < this.effectCfgTab.length; i++) {
			if (this.effectCfgTab[i].id == effectId) {
				if (this.effectCfgTab[i].ball_id) {
					id = this.effectCfgTab[i].ball_id;
				} else if (this.effectCfgTab[i].buff_id) {
					id = this.effectCfgTab[i].buff_id;
				}
			}
		}
		let effectDamage: number = 0;
		for (let i = 0; i < this.ballCfgUpTab.length; i++) {
			if (id == this.ballCfgUpTab[i].ball_id && this.ballCfgUpTab[i].damage) {
				for (let j = 0; j < this.ballCfgUpTab[i].damage.length; j++) {
					if (this.ballCfgUpTab[i].damage[j].level == lv) {
						effectDamage = this.ballCfgUpTab[i].damage[j].dmg;
						break;
					}
				}
			}
		}
		for (let i = 0; i < this.buffCfgUpTab.length; i++) {
			if (id == this.buffCfgUpTab[i].buff_id && this.buffCfgUpTab[i].damage) {
				for (let j = 0; j < this.buffCfgUpTab[i].damage.length; j++) {
					if (this.buffCfgUpTab[i].damage[j].level == lv) {
						effectDamage = this.buffCfgUpTab[i].damage[j].dmg;
						break;
					}
				}
			}
		}
		return effectDamage;
	}

	//保存特技配置操作
	public seteffectCfgListData(data: any): void {
		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < this.effectList.list.length; j++) {
				let effect = this.effectList.list[j];
				if (effect.id == data[i]) {
					this.effectCfgList.list[i].effectId = effect.itemId;
					this.effectCfgList.list[i].isConfig = true;
					break;
				}
			}
		}
		this.interimCfg = [];
	}

	//领取邮件奖励获得的特技数据处理
	public refreshData(data: any): void {
		if (!this.effectList.list) {
			return;
		}
		for (let key in data) {
			if (Number(key) == enums.Get_Skill) {
				for (let i = 0; i < data[key].length; i++) {
					let skillData = data[key][i];
					for (let j = 0; j < this.effectList.list.length; j++) {
						let effectData = this.effectList.list[j];
						if (skillData.itemId == effectData.itemId) {
							effectData.effectOther.effectChipNum += skillData.amount;
							break;
						}
					}
				}
			}
		}
	}
	addEffect(data: any) {
		for (let i = 0; i < data.length; i++) {
			let obj = data[i];
			for (let j = 0; j < this.effectList.list.length; j++) {
				let effect_obj = this.effectList.list[i]
				if (obj.itemId == effect_obj.itemId) {
					effect_obj.effectOther.effectChipNum += obj.amount;
					break;
				}
			}
		}
	}
	getAllTypeItem(data){
		console.log(data)
		if(data[enums.Get_Skill]){
			this.addEffect(data[enums.Get_Skill])
		}
	}
}