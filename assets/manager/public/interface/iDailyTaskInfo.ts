export interface dailyTaskList {
    list: dailyTask[],
}

export interface dailyTask {
    id: number,                 //每日任务id
    name: string,               //每日任务标题
    des: string,                //每日任务内容
    received: boolean,          //是否已领取奖励
    type: number,               //每日任务条件类型
    progress: number,           //每日任务进度
    parameter: number,          //每日任务条件参数
    activeValue: number,        //活跃度奖励
    rewarks: rewark[],          //任务奖励
    exp: number,                //可获得经验换算值
}

export interface activeBoxesList {
    list: activeBoxes[],
}

export interface activeBoxes {
    id: number,                 //活跃度宝箱id
    type: number,               //宝箱类型
    isOpen: boolean,            //是否开启
    condition: number,          //开启宝箱需要的总活跃度
    rewarks: rewark[],          //可获得的奖励
}

export interface rewark {
    type: number,           //奖励类型
    itemId: number,         //奖励id
    amount: number,         //奖励数量
}