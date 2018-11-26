//玩家信息数据模型

//玩家信息数据
export interface user {
	userUID: number;			//玩家UID
	roleId: number;				//当前使用的角色卡
	userName: string;			//玩家昵称
	userExp: number;			//玩家经验值
	experience: number;			//升级所需经验值
	grade: number;				//玩家等级
	winNum: number;				//胜利局数
	winProbability: number;		//胜率
	mostRank: number;			//最高段位
	effects: number;			//解锁的特技数量
	oftenEffect: string;		//常用特技
	vipLv: number;				//vip等级
	guildId:number;				//公会ID
}

//玩家段位数据
export interface userRank {
	stageStar: number;			//玩家星级
	stage: number;				//玩家段位id,设置需要显示的段位图片
	stageScore: number;			//积分
}

//玩家战斗数据
export interface userBattle {
	hp: number;					//玩家血量
	atk: number;				//玩家伤害
	ctr: number;				//玩家暴击
	crtdamage: number;			//玩家暴击伤害
	effectList: any[];			//出战技能表
}

//货币数据
export interface userMoney {
	gold: number;				//玩家金币
	crystal: number;			//玩家粉晶
	diamond: number;			//玩家钻石
}

//修改昵称数据
export interface changeName {
	spendCrystal: number;		//花费的粉晶数量
	isShareGame: boolean;		//是否分享游戏，用于免费一次修改昵称。
}