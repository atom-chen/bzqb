export interface boxData{
        boxType:number  //宝箱类型
        boxPrice:number //宝箱价格
        boxGift:number // 宝箱附赠
        boxReward:any[] //宝箱奖励
}
export interface moneyData{
    moneyType:number  //金币类型
    moneyPrice:number //金币价格
    moneyGift:number // 金币附赠
    moneyReward:number //金币奖励
}
export interface crystalData{
    crystalType:number  //粉晶类型
    crystalPrice:number //粉晶价格
    crystalGift:number // 粉晶附赠
    crystalReward:number //粉晶奖励
}

export interface treasureData{
    treasureIcon:URL //宝物图标
    treasure:any[] //宝物
    treasureName:string //宝物名字
    treasureDepreciation:number //宝物折扣
    treasurePrice:number//宝物价格
    treasureState:boolean//宝物是否已购买
    refreshTime:number//刷新次数
    refreshPrice:number//刷新价格
    refreshResidueTime:number//刷新剩余时间
}