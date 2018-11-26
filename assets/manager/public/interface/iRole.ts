//角色数据模型

//角色数据
export interface role {
	id: number;					//递增id  发给服务器判断用
	roleId: number;				//角色id，与角色的头像和图片有关
	isUnlock: boolean;			//角色是否解锁
	isUsing: boolean;			//角色是否使用中
	itemId: number;				//道具碎片的id
	roleChipNum: number;		//解锁角色所需的碎片数量
	userRoleChipNum: number;	//玩家持有的碎片数量
	spendGold: number;			//解锁花费的金币数量
	spendCrystal: number;		//解锁花费的粉晶数量
	spendDiamond: number;		//解锁花费的钻石数量
	vipLimite: number;			//解锁需要的vip等级限制
}