export interface PlayerData{
    talentPoint:number //天赋点
    talentAlready:any[] //已有天赋
}

export interface talentData{
    talentType:number //天赋种类
    talentName:string //天赋名字
    talentPremise:any[]  //学习天赋前提
    talentProperty:any[] //天赋属性
    talentText:string //天赋文本
}

export interface talentResetData{
    ResetTime:number    //重置时间
    ResetPrice:number //重置价格
}