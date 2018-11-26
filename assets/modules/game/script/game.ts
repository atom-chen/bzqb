import Emitter from "../../../framework/modules/Emitter";
import fightRandomSeed from "./common/fightRandomSeed";
import BaseGameFight from "./baseClass/BaseGameFight";
import fightBaseMissile from "./missile/fightBaseMissile";

/*
author: 黄凯
日期:2018-11-19
*/
// 碰撞
let wmCollisionManager = require("hkCollisionManager");
// 物理
import HkPhysics from "./physics/hkPhysics";

// 玩家操作数据单利
import PlayerCtrlData from "./modles/PlayerCtrlData";
// 玩家管理器
import fightPlayerMgr from "./fightPlayerMgr";
// 炮弹管理器
import fightMissileMgr from "./fightMissileMgr";
// 快速开始游戏
import fightNetMgr from "./net/fightNetMgr";
// 帧数池管理器
import fightNetPoolMgr from "./net/fightNetPoolMgr";
// 工具
import fightTool from "./common/fightTool";
// 游戏配置
import config from "./common/gameConfig";
// 地图管理器
import MapMgr from "./sceneMgr/mapMgr";


const { netFrame , fightEvent , missileType ,missileBuffType } = config;
const { ccclass, property } = cc._decorator;

// 随机数
let randomSeed = fightRandomSeed.getInstance();
// 事件
let emitter = Emitter.getInstance();
// 物理
let wmPhysicsManager = HkPhysics.getInstance();
// 单例玩家操作数据模型
let playerCtrlData = PlayerCtrlData.getInstance();
// 地图管理器
let mapMgr:MapMgr = MapMgr.getInstance();

@ccclass
export default class GameCtrl extends BaseGameFight{

    // 玩家管理器
    private fightPlayerMgr:fightPlayerMgr;
    // 炮弹管理器
    private fightMissileMgr:fightMissileMgr;
    // 网络链接测试
    private fightNetMgr:fightNetMgr;
    // 帧管理器
    private fightNetPoolMgr:fightNetPoolMgr;
    // UI组件

    // 玩家的预制体数组
    @property([cc.Prefab])
    rolePrefab: cc.Prefab[] = [];

    // 导弹的预制体数组
    @property([cc.Prefab])
    missilePrefab: cc.Prefab[] = [];

    // 父级节点
    @property(cc.Node)
    fatherNode: cc.Node = null;

    // 玩家操作的ui
    @property(cc.Prefab)
    playerCircleCtrl: cc.Prefab = null;

    // 前景图片节点
    @property(cc.Node)
    prospectNode: cc.Node = null;

    // 地图前景图片
    @property({type: cc.Texture2D})
    prospectPicture:cc.Texture2D = null;

    // 弹坑图片
    @property({type: cc.Texture2D})
    craterPicture:cc.Texture2D = null;
    

    init(){
        this.fightPlayerMgr = new fightPlayerMgr();
        this.fightNetMgr = new fightNetMgr();
        this.fightNetPoolMgr = new fightNetPoolMgr();
        this.fightMissileMgr = new fightMissileMgr();
        wmPhysicsManager.enabled = true;
        wmCollisionManager.enabled = true;
        this.bindInit();
        this.bindEvent();
        mapMgr.initMap(this.fatherNode,this.prospectNode,this.prospectPicture,this.craterPicture);
    }


    bindEvent(){
        // 绑定切换玩家事件 
        emitter.on(fightEvent.changeProcess,this.changeProcess,this);
        // 碰撞结算
        emitter.on(fightEvent.colliderSettle,this.colliderSettle,this);
    }

    // 初始化一些绑定
    bindInit(){
        let netEvent = {
            "onMatch":this.onMatch.bind(this),
            "onFightState":this.onFightState.bind(this),
            "onFightFrame":this.onFightFrame.bind(this),
            "matchState":this.matchState.bind(this),
            "matchSuccess":this.matchSuccess.bind(this)
        };
        this.fightNetMgr.init(netEvent);
        this.fightMissileMgr.init(this.missilePrefab,this.fatherNode);
        this.fightPlayerMgr.setFatherNode(this.fatherNode);
    }

    onLoad() {
        // 测试匹配直接进入房间
        this.init();
        // 测试连接
        this.fightNetMgr.connect((data)=>{
            console.log(data);
            this.fightNetMgr.match("1",(data2)=>{
                console.log(data2);
            });
        });
    }




    // ----------这部分某些是测试代码-------------
    onMatch(data){
        console.log(data);
    }
    // 战斗的状态情况
    onFightState(data){
        console.log(data);
    }
    // 将网络帧推送给真管理器
    onFightFrame(data){
        this.fightNetPoolMgr.addFrame(data.msg);
    }
    // 匹配中的状态
    matchState(data){
        let msg = data.msg;
        switch (msg.state) {
            case 7:
                let info = msg.info;
                // 这里初始化要注意和后面游戏正式准备产生冲突
                console.log("开始游戏",info)
                // TODO 随机种子下发
                randomSeed.init(2333);
                this.fightPlayerMgr.init(this.rolePrefab,null);
                // this.fightPlayerMgr.init(this.rolePrefab,info.playerInfo);
                this.fightPlayerMgr.setMySeatId(info.mySeatId.toString());
                this.fightPlayerMgr.setMyCircleCtrl(this.playerCircleCtrl);
                // 战斗前准备
                this.fightNetMgr.gameParpare(()=>{
                    console.log("玩家准备了");
                });
                // 这里可能暂时不同步
                this.gameSwitch = true;
                break;
        }
    }
    // 匹配成功
    matchSuccess(data){
        console.log("匹配成功",data);
        // console.log(data);
        // TODO 初始化随机种子
    }

    // ---------测试代码结束--------------


    // 游戏流程切换
    changeProcess(){
        // TODO 单独做一个管理模块管理游戏进程中的事物

        // 1，检测游戏是否已经结束 游戏结束不继续切换
        // 2，场景物品切换 如宝箱 空投 龙卷风 火主 风向 等


        // 3，玩家操作切换
        this.frameTimeout(()=>{
            this.fightPlayerMgr.changePlayer();
            // 相机回弹
            emitter.emit(fightEvent.setZoomRatio,1);
        },3*netFrame);
        console.log("切换流程");
    }


    // 炮弹碰撞结算
    colliderSettle(obj){

        // 是否是飞机
        let isPlane = obj.isPlane;
        // 玩家的座位id
        let seatId = obj.seatId;
        // 炮弹的位置
        let realPoi = obj.realPoi;
        // 飞机不参与任何结算 爆炸等
        if(isPlane){
            // 位移玩家 
            this.fightPlayerMgr.setPlayerNewPoi(seatId,realPoi);
            return;
        }
        // 活着的玩家的点位信息
        let seatIdToRealPoi = this.fightPlayerMgr.getLivePlayers();
        // 椭圆半径
        let ellipseRange = obj.ellipseRange;
        // 导弹类型
        let missBuffType = obj.missileBuffType;
        // 子弹威力
        let power = obj.power;
        // 绘制弹坑碰撞体
        let missilePoints = fightTool.createPoint(ellipseRange,realPoi);
        // 挖坑实现
        mapMgr.digHole(realPoi,ellipseRange);

        // 碰撞检测 与 加血扣血
        for(let seatId in seatIdToRealPoi){
            let playerPoi = seatIdToRealPoi[seatId];
            let isCollider = fightTool.pointInPolygon(playerPoi, missilePoints);
            if(isCollider){
                let player = this.fightPlayerMgr.getPlayerBySeatId(seatId);
                player.resetPoi();
                // 根据炮弹类型对玩家加血或者扣血操作
                switch(missBuffType){
                    case missileBuffType.sub:
                    player.subHp(power);
                    break;
                    case missileBuffType.add:
                    player.addHp(power);
                    break;
                }
            }
        }

    }


    // TODO 发送玩家操作数据
    getSendFrameMsg(){
        // 当前是我的回合
        if(this.fightPlayerMgr.checkPlayerIsMine()){
            let data = playerCtrlData.getData();
            let msg = {
                data: data
            };
            this.fightNetMgr.send(msg);
        }
        playerCtrlData.clear();
    }


    // 运行帧数据
    doFrame(){
        let hisFrameCount = this.fightNetPoolMgr.hisTroyFrameCount;
        // 当开始1秒钟后 开始第一名玩家的操作
        if(hisFrameCount === netFrame){
            this.fightPlayerMgr.goPlayerAction();
        }
        // 获取玩家操作并发送操作数据
        this.getSendFrameMsg();
        // 获取最后一条数据
        let msg = this.fightNetPoolMgr.getLastFrame();
        // 更新玩家管理器
        this.fightPlayerMgr.netFrame(msg);
        // 触发逻辑运算
        emitter.emit(fightEvent.netFrame);
        // 检测地图与导弹的碰撞
        this.checkMissileMapCollider();
        // 物理更新
        wmPhysicsManager.netFrame();
        // 检测碰撞
        wmCollisionManager.netFrame();
        // 延迟事件
        this.frameRun();
    }


    // 检测地图与炮弹的碰撞
    checkMissileMapCollider(){
        let missiles = this.fightMissileMgr.getAllLiveMissile();
        for(let i = missiles.length-1;i>=0;i--){
            let missile:fightBaseMissile = missiles[i];
            let realPoi = missile.getRealPoi();
            if(mapMgr.checkCollideGround(realPoi)){
                missile.setRealPoi(mapMgr.getNextPoint(realPoi,0,0));
                missile.onMapCollider();
            }
        }
    }



    // TODO ui部分单独移除做为管理器
    // 游戏是否开始
    gameSwitch:boolean;
    // 整战斗中只有一个
    update(dt) {

        emitter.emit(fightEvent.netUpdate);
        if (!this.gameSwitch) return;
        // 是否可以运行逻辑
        if(this.fightNetPoolMgr.getCanDoNetFrame(dt)){
            this.doFrame();
            // 帧数滞留的时候出现菊花
            while(this.fightNetPoolMgr.checkCanWhile()){
                this.doFrame();
            }
            
        }
    }

    // 销毁该管理器
    onDestroy() {
        emitter.off(fightEvent.changeProcess,this);
        // super.onDestroy();
    }
}
