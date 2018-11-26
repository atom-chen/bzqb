export interface playerVipData{
    vipLevel:number //vip等级
    vipExp:number //vip经验
    vipneedExp:number //vip升级所需经验
}

export interface vipGift {
    giftType:number //礼包类型
    giftPrice:number //礼包价格
    giftState:boolean //是否已购买
    giftReward:any[] //礼包奖励 
}

export interface vipBox {
    boxType:number //宝箱类型
    boxState:boolean //是否已购买
    boxReward:any[] //宝箱奖励
}