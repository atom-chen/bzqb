//好友数据模型

//好友界面显示数据
export interface friendShow {
	friendsNum: number;			//拥有的好友数量
	mostFriendsNum: number;		//好友数量上限
	friendList: friend[];		//好友列表
}

//添加好友数据
export interface addFriend {
	list: friend[];				//推荐的好友列表
}

//好友数据、推荐数据
export interface friend {
	id: number;				//用户的唯一标识
	headUrl: any;					//如果是角色头像用角色id获，其他待定
	nickname: string;				//好友名称
	sex: number;				//好友性别
	tank: string;				//好友段位
	vipLv: number;				//好友vip等级
	guildName: string;			//好友公会名称
	guildId: number;			//好友工会ID
	online: boolean;			//是否在线
}

//聊天数据
//export interface chat {
//	ownChatNews: string;		//自己发送的聊天消息
//	friendChatNews: string;		//好友发送的聊天消息
//	newsSend: number;			//消息发送时间，用于判断好友和自己发送的消息前后顺序
//}

export interface chatList {
	list: chatItem[];
}

export interface chatItem{
	chatContent: chat[];	
}

export interface chat{
	fromID: number;				//内容发送者
	content: string;			//聊天内容
}