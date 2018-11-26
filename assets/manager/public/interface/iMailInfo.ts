export interface mailsData {
    list: mail[],
}

export interface mail {
    id: number,             //邮件id
    bReaded: boolean,       //邮件读取状态
    bRec: boolean,          //邮件领取状态
    title: string,          //邮件标题
    sendTime: string,       //邮件发送时间
    residueTime: number,    //邮件剩余时间
    content: string,        //邮件内容
    reward: mail_rewark[],  //邮件奖励
}

export interface mail_rewark {
    amount: number,         //奖励的数量
    itemId: number,         //奖励的id
    type: number,           //奖励的类型
}