export interface signInList {
    list: signIn[],             //全部签到
}

export interface signIn {
    isSignIn: boolean,          //是否签到
    signInDay: number,          //第N天
    again_signIn: boolean,      //是否可补签
    vipLv: number,              //vip等级，显示左上角vip角标
    rewark: signInRewark,       //显示的奖励
}

export interface totalSignInList {
    list: totalSignIn[],        //累积宝箱数据
}

export interface totalSignIn {
    isOpen: boolean,            //是否开启
    totalSignInDay: number,     //需要累积签到的天数
    rewarkList: signInRewark[], //显示的奖励
}

export interface signInRewark {
    type: number,               //获得奖励类型  枚举表
    itemId: number,             //图片显示id
    amount: number,             //奖励的数量
}