export interface myData{
        master:boolean //是否为房主
        name:number  //用户名字
        vipLevel:number//用户vip等级
        head:URL//头像
}
export interface teammateData{
    master:boolean //是否为房主
    name:number//队友名字
    vipLevel:number//队友vip等级
    head:URL//队友头像
}

export interface enemyData{
    name:number//敌人名字
    vipLevel:number//敌人vip等级
    head:URL//敌人头像
}

export interface loadData{
    map:URL//地图  
    tips:string //提示
}

export interface roomData{
   watch:number //观众人数
}