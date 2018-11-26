//活动数据模型

//新人邀请界面数据
export interface activityInvite {
	inviteNum: number;			//当前邀请好友的人数
	rewarkList: inviteRewark[];	//奖励组成的表
}

//邀请奖励数据
export interface inviteRewark {
	rewarkId: number;			//奖励id，显示奖励图片
	rewarkNum: number;			//奖励数量
	conditions: number;			//邀请需要的人数
	isReceive: boolean;			//是否领取
}

//每日分享数据
export interface dailyShare {
	isShare: boolean;			//是否分享
	isReceive: boolean;			//是否领取
}

//七天登录数据
export interface loginRewarkList {
	list: loginRewark[];		//七天登录奖励列表
}
//七天登录奖励数据
export interface loginRewark {
	rewarkType: number;			//奖励类型，宝箱  粉晶等
	rewarkId: number;			//奖励id，显示奖励图片
	rewarkNum: number;			//奖励数量
	isReceive: boolean;			//是否领取
}