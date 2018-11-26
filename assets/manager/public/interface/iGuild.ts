//公会数据模型

//未加入界面

//公会列表数据
export interface guildList {
	list: guild[];				//公会组成的表
}

//公会数据
export interface guild {
	icoId: number;				//公会图标id
	name: string;				//公会名称
	userNum: number;			//公会人数
	joinCondition: string;		//加入条件	段位限制
	type: number;				//公会加入类型  允许任何人  不允许加入  需要批准
}

//邀请列表数据
export interface inviteList {
	list: inviteInfo[];			//邀请信息组成的表
}

//邀请信息数据
export interface inviteInfo {
	inviteName: string;			//邀请人名称
	inviteGuildName: string;	//邀请的公会名称
}

//加入公会界面

//公会信息数据
export interface guildInfo {
	icoId: number;				//公会图标id
	lv: number;					//公会等级
	exp: number;				//公会经验值
	upGuildExp: number;			//公会升级所需的经验值
	name: string;				//公会名称
	allDonate: number;			//总捐献点数
	guildUserNum: number;		//公会人数
	mostUserNum: number;		//上限人数
	type: number;				//公会加入类型  允许任何人  不允许加入  需要批准
	joinCondition: string;		//加入条件  段位限制
	id: number;					//公会id
	notice: string;				//公会公告
	memberList: guildMember[];	//公会成员列表	
}

//公会成员数据
export interface guildMember {
	ranking: number;			//成员排名
	headId: number;				//成员头像图片id
	name: string;				//成员名称
	job: string;				//成员职位
	rank: string;				//成员段位
}

//宝箱活动数据
export interface rewarkBoxActivity {
	overplusTime: number;		//剩余时间   时间戳
	allKeyNum: number;			//全部钥匙数量  用于开启宝箱
	rewarkBoxLv: number;		//宝箱等级
	nextLvRewark: any[];		//宝箱下一级奖励
	memberRanking: number;		//成员排名
	haveKeyNum: number;			//拥有的钥匙数量
}

//公会商店数据
export interface guildShop {
	countDownTime: number;		//剩余刷新时间
	refreshSpend: number;		//刷新费用   一般手动刷新使用
	goodsList: goods[];			//商品列表
}

//公会商店商品数据
export interface goods {
	name: string;				//商品名称
	star: number;				//商品星级
	num: number;				//商品数量
	univalent: number;			//商品单价
	isSellOut: boolean;			//是否售罄
	buyNum: number;				//购买次数
	buyNumLimite: number;		//购买次数限制
}

//申请列表数据
export interface applyGuildList {
	list: applyGuild[];			//申请人列表
}

//申请加入公会玩家数据
export interface applyGuild {
	applyUserHead: any;			//申请人头像
	applyUserName: string;		//申请人名称
	applyUserRank: string;		//申请人段位
}