import BaseMgr from "../../framework/baseClass/BaseMgr";
import Package from "../../framework/net/package";
import { dataids } from "../../framework/net/dataids";
import { enums } from "../enums";

import { chatList, chatItem, chat } from "../../manager/public/interface/iFriend";
import RegisterCtrl from "../../modules/login/script/registerPanel";

export default class FriendsMgr extends BaseMgr {
    public friendsIds = null;
    public friendsInfoList = null;
    public friendsId = null;
    public friendsIdKicked = null;
    public myId = null

    private searchResult = [];

    public chatContent:chatList = <chatList>{}

    constructor() {
        super();
        this.routes = {
            'plaza.data.reqFriendIds': this.plaza_data_reqFriendIds,
            'search.entry.reqFriendInfos': this.search_entry_reqFriendInfos,
            'plaza.friends.addFriend': this.plaza_friends_addFriend,
            "plaza.friends.kickFriend": this.plaza_friends_kickFriend,
            "search.entry.searchUsers": this.search_entry_searchUsers,
            "search.entry.randomUsers": this.search_entry_randomUsers,
            "onChat":this.onChat,

            "onNewFriend": this.onNewFriend,
            "onKickedByFriend": this.onKickedByFriend,
        };
    }
    clearDatas()
    {
        this.friendsIds = null;
        this.friendsInfoList = null;
        this.friendsId = null;
        this.friendsIdKicked = null;
    }

    //返回推荐好友
    public search_entry_randomUsers(msg: Package){
        let userInfo = msg.getDataByType(dataids.ID_USERLIST);
    }

    public isAlwaysSearch(data): any{
        var count = this.searchResult.length
        for(var i = 0; i < count; i++){
            var userInfo = this.searchResult[i]
            if(userInfo.nickname == data || userInfo.id == parseInt(data)){
                return userInfo
            }
        }

        return null
    }

    //搜索用户返回
    public search_entry_searchUsers(msg: Package){
        let userInfo = msg.getDataByType(dataids.ID_USERLIST);

        for(var i = 0; i < userInfo.length; i++){
            this.searchResult.push(userInfo[i])
        }
        this.searchResult = userInfo
        if(userInfo.length > 0){
            this.gemit("friends_search_Result", userInfo[0]);
        }
    }

    //判断是否好友
    isFriend(id)
    {
        for (let friendsIdsIdx = 0; friendsIdsIdx < this.friendsIds.friends.length; friendsIdsIdx++) {
            if(this.friendsIds.friends[friendsIdsIdx] == id) {
                return true;
            }
        }
        return false;
    }
    // 单例处理
    private static _instance: FriendsMgr = null;
    public static getInstance(): FriendsMgr {
        if (FriendsMgr._instance == null) {
            FriendsMgr._instance = new FriendsMgr();
        }
        return FriendsMgr._instance;
    }

    private plaza_data_reqFriendIds(msg: Package): void {
        this.friendsIds = msg.getDataByType(dataids.ID_FRIEND_IDS);
        if(this.friendsIds){
            this.myId = this.friendsIds.id
            this.reqFriendInfos(this.friendsIds.friends)
        }
    }

    private search_entry_reqFriendInfos(msg: Package): void {
        this.friendsInfoList = msg.getDataByType(dataids.ID_FRIENDINFOLIST);
    }

    public onNewFriend(msg:Package): void {
        let addFriendId = msg.getData().friendId
        this.addnewIdToIDs(addFriendId)
        this.reqFriendInfos(this.friendsIds.friends)
    }

    public plaza_friends_addFriend(msg: Package): void {
        let addFriendId = msg.getDataByType(dataids.ID_ADDFRIEND);
        this.addnewIdToIDs(addFriendId)
        this.reqFriendInfos(this.friendsIds.friends)
    }

    private addnewIdToIDs(id){
        if(this.friendsIds&&this.friendsIds.friends) {
            this.friendsIds.friends.push(id);
        }
        else{
            this.friendsIds={};
            this.friendsIds.friends=[];
            this.friendsIds.friends.push(id);
        }
    }

    public onKickedByFriend(msg:Package): void{
        let friendsIdKicked = msg.getData().friendId
        this.delIdFromIds(friendsIdKicked)
        this.reqFriendInfos(this.friendsIds.friends)
    }

    public plaza_friends_kickFriend(msg: Package): void {
        let friendsIdKicked = msg.getDataByType(dataids.ID_KICKFRIEND);
        this.delIdFromIds(friendsIdKicked)
        this.reqFriendInfos(this.friendsIds.friends)
    }

    private delIdFromIds(id){
        let count = this.friendsIds.friends.length
        for(var i = 0; i < count; i++){
            if(id == this.friendsIds.friends[i]){
                this.friendsIds.friends.splice(i, 1)
                break
            }
        }
    }

    public onChat(msg: Package): void {
        let data = msg.getDataByType(dataids.ID_CHAT_WITH_FRIEND);
        
        if(!this.chatContent.list){
            this.chatContent.list = []
        }

        let l_chat:chat = <chat>{}
        l_chat.fromID = data.from
        l_chat.content = data.content

        let uid
        if(data.from == this.myId){
            uid = data.to
        }else if(data.to == this.myId){
            uid = data.from
        }

        if(!this.chatContent.list[uid]){
            this.chatContent.list[uid] = <chatItem>{}
            this.chatContent.list[uid].chatContent = []
        }
        this.chatContent.list[uid].chatContent.push(l_chat)
        this.gemit("chat.recNewChat", uid, l_chat);
    }

    public getFriendInfos(id): any{
        let l_count = this.friendsInfoList.length
        let info
        for(var i = 0; i < l_count; i++){
            if(this.friendsInfoList[i].id == id){
                info = this.friendsInfoList[i]
                break
            }
        }
        return info
    }

    public reqFriendIds(): void {
        let route = 'plaza.data.reqFriendIds';
        this.send_msg(route);
    }

    public reqFriendInfos(data: any): void {
        let route = 'search.entry.reqFriendInfos';
        this.send_msg(route,{'ids':data});
    }

    public addFriend(data: any): void {
        let route = 'plaza.friends.addFriend';
        this.send_msg(route,{'friendId':data});
    }

    public kickFriend(data: any): void {
        let route = 'plaza.friends.kickFriend';
        this.send_msg(route,{'friendId':data});
    }

    public searchFriend(data:any): void{
        let route = 'search.entry.searchUsers';
        this.send_msg(route,{'key':data});
    }

    public searchRandomUsers(){
        let route = 'search.entry.randomUsers'
        this.send_msg(route)
    }

    public sendChat(from:any, to:any, content:any): void {
        let route = 'chat.entry.chatWithFriend'
        this.send_msg(route, {'from':from, 'to':to, 'content':content})
    }

}
