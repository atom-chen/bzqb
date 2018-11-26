export interface palyerData{
        head:URL //头像
        name:string //名字
        vipLevel:number //数字
        level:number //等级
        exp:number //经验
        curRose:any[]//当前使用的角色
        boxList:any[]//宝箱栏
}

export interface otherData{
    winBox:any[]//胜利宝箱
    onlineBox:any[]//在线宝箱
    mailState:boolean//是否有新邮件
}  