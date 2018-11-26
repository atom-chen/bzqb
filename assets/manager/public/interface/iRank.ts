//排行榜数据模型

//排行榜数据
export interface rankingList {
	list: rankingInfo[];		//排行榜玩家组成的表
}

//排行榜玩家数据
export interface rankingInfo {
	ranking: number;			//排名
	rankingState: number;		//排名状态  上升 下降 不变
	userName: string;			//玩家名称
	guildName: string;			//公会名称
	userRankId: number;			//玩家段位，用于图标显示
	rankingName: string;		//段位名称
	rewarkStarNum: number;		//排名奖励的星星数量
}