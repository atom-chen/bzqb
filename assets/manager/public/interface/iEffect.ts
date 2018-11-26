//特技数据模型

//特技界面数据
export interface effectList {
	list: effect[];				//特技组成的表
}
//特技数据
export interface effect {
	name: string;				//特技名称
	type: number;				//特技类型  法术  物理
	explain: string;			//特技说明
	id: number;					//特技id
	itemId: number;				//图片id
	lv: number;					//特技等级
	star: number;				//特技星级
	damage: number;				//特技伤害
	energy: number;				//特技能量
	effectOther: effectOther;	//特技升级相关数据
}

//特技升级相关数据
export interface effectOther {
	effectChipNum: number;		//特技持有碎片
	upEffectChipNmu: number;	//特技升级所需碎片
	isUnlock: boolean;			//特技是否解锁
	isConfig: boolean;			//特技是否装备，用于打勾显示
	nextLvDamage: number;		//下一级增加的伤害
	getExp:	number;				//升级可得到的经验值
	spendGold: number;			//升级需要花费的金币数量
}

//特技装备栏数据
export interface effectCfgList {
	list: effectCfg[];
}

//配置特技数据
export interface effectCfg {
	isConfig: boolean;			//特技装备栏是否配置
	effectId: number;			//装备的特技图片id
}