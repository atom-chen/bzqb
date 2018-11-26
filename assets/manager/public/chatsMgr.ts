import BaseMgr from "../../framework/baseClass/BaseMgr";
import Package from "../../framework/net/package";
import { dataids } from "../../framework/net/dataids";
import { enums } from "../enums";
import GuildsMgr from "./guildsMgr";

import { chatList, chatItem, chat } from "../../manager/public/interface/iFriend";
import { date } from "../../framework/lib/jszip/defaults";

let ChannelType = {
    Channel_World:1,
    Channel_Guild:2,
}

export default class ChatsMgr extends BaseMgr {

    public chatContent:chatList = <chatList>{}
    public usersInfo = []

    constructor() {
        super();
        this.routes = {
            "onWorldChat": this.onWorldChat,
            "onGuildChat": this.onGuildChat,

            "search.entry.reqUserBrief": this.search_entry_reqUserBrief,
        };
    }

    public search_entry_reqUserBrief(msg: Package): void{
        let data = msg.getDataByType(dataids.ID_USER_BRIEF);
        this.usersInfo[data.id] = data
        
        //this.gemit("chats.updateUserInfo", data);
    }
    
    // 单例处理
    private static _instance: ChatsMgr = null;
    public static getInstance(): ChatsMgr {
        if (ChatsMgr._instance == null) {
            ChatsMgr._instance = new ChatsMgr();
        }
        return ChatsMgr._instance;
    }

    public onWorldChat(msg: Package): void{
        let data = msg.getDataByType(dataids.ID_CHAT_TO_WORLD)

        if(!this.chatContent.list){
            this.chatContent.list = []
        }

        let l_chat:chat = <chat>{}
        l_chat.fromID = data.from
        l_chat.content = data.content

        if(!this.chatContent.list[ChannelType.Channel_World]){
            this.chatContent.list[ChannelType.Channel_World] = <chatItem>{}
            this.chatContent.list[ChannelType.Channel_World].chatContent = []
        }
        this.chatContent.list[ChannelType.Channel_World].chatContent.push(l_chat)

        if(!this.usersInfo){
            this.usersInfo = []
        }

    }

    public onGuildChat(msg: Package): void{
        let data = msg.getData()

        if(!this.chatContent.list){
            this.chatContent.list = []
        }

        let l_chat:chat = <chat>{}
        l_chat.fromID = data.from
        l_chat.content = data.content

        if(!this.chatContent.list[ChannelType.Channel_Guild]){
            this.chatContent.list[ChannelType.Channel_Guild] = <chatItem>{}
            this.chatContent.list[ChannelType.Channel_Guild].chatContent = []
        }
        this.chatContent.list[ChannelType.Channel_Guild].chatContent.push(l_chat)
        this.gemit("guildChat.recNewChat", l_chat);
    }

    public sendReqUserBrief(data:any){
        let msg = {
            target:data
        }
        this.send_msg("search.entry.reqUserBrief", msg)
    }


    public sendWorldChat(data:any){
        this.sendChat("chat.entry.chatToWorld", data)
    }

    public sendGuildChat(data:any){
        this.sendChat("chat.entry.chatToGuild", data)
    }

    private sendChat(route:any, data:any){
        let msg = {
            content: data
        }
        this.send_msg(route, msg)
    }
}
