import Emitter from "../modules/Emitter";
import ModuleMgr from "../modules/ModuleMgr";
import LogMgr from "../modules/LogMgr";
import Loader from "../modules/Loader";

export default class BaseCtrl extends cc.Component {
    protected ui: any;
    protected model: any;
    protected view: any;
    // 网络事件和回调映射
    protected n_events: object;
    // 全局事件和回调映射
    protected g_events: object;
    protected bindedNodes: cc.Node[] = [];
    private _clickEnable: boolean = true;
    // 发送全局事件
    protected gemit(event: string, ...args: any[]): void {
        Emitter.getInstance().emit(event, ...args);
    }
    // 定义网络事件
    protected defineNetEvents(): void {
        this.n_events = {};
    }
    // 定义全局事件
    protected defineGlobalEvents(): void {
        this.g_events = {};
    }
    // 注册所有事件
    protected regAllEvents() {
        //注册网络事件
        for (let event in this.n_events) {
            Emitter.getInstance().on(event, this.n_events[event], this);
        }
        //注册全局事件
        for (let event in this.g_events) {
            Emitter.getInstance().on(event, this.g_events[event], this);
        }
    }
    /**
	 * 打开子模块
	 * @param moduleName 模块名
	 */
    public openSubModule(moduleName: string, isPublic: boolean = false): Promise<any> {
        return ModuleMgr.getInstance().openSubModule(moduleName, isPublic);
    }

    public getPrefabSync(moduleName: string, isPublic: boolean = false): cc.Prefab {
        let url = ModuleMgr.getInstance().getResUrl("prefab", moduleName, isPublic);
        return Loader.getInstance().getRes(url, cc.Prefab);
    }
    /**
     * 关闭模块
     * @param moduleName 模块名
     */
    public closeModule(moduleName: string): void {
        ModuleMgr.getInstance().closeModule(moduleName);
    }

    /**
	 * 切换场景
	 * @param sceneName 场景名
	 */
    public switchScene(sceneName: string): void {
        ModuleMgr.getInstance().switchScene(sceneName);
    }
    /**
     * 绑定UI操作
     * @param type 监听的UI操作事件,与引擎一致
     * @param node 响应操作的节点
     * @param callback UI操作事件回调
     * @param opname 操作描述
     */
    protected connect(type: string, target: any, callback: (event?: any) => void, opname: string) {
        let node = target instanceof cc.Node ? target : target.node;
        switch (type) {
            case "click": this.bindButton(node, callback, opname); break;
            default: this.bindOtherHandle(type, node, callback, opname);
        }
        if (this.bindedNodes.indexOf(node) == -1) {
            this.bindedNodes.push(node);
        }
    }

    private bindButton(node: cc.Node, callback: (event?: any) => void, opname: string): void {
        let btnCb = (event) => {
            if (!this._clickEnable) return;
            this._clickEnable = false;
            this.scheduleOnce(() => {
                this._clickEnable = true;
            }, 0.3);
            LogMgr.getInstance().addOpreation(opname);
            callback.call(this, event);
        };
        node.on("click", btnCb, this);
    }

    private bindOtherHandle(type: string, node: cc.Node, callback: (event?: any) => void, opname: string): void {
        let handleCb = (event) => {
            LogMgr.getInstance().addOpreation(opname);
            callback.call(this, event);
        };
        node.on(type, handleCb, this)
    };

    protected connectUi(): void {

    }

    protected initMvc(Model: any, View: any): void {
        // 数据模型
        this.model = new Model();
        // 视图
        this.view = new View(this.model);
        this.ui = this.view.ui;
        // 定义网络事件
        this.defineNetEvents();
        // 定义全局事件
        this.defineGlobalEvents();
        // 注册所有事件
        this.regAllEvents()
        // 绑定ui操作
        this.connectUi();
    }
    /** 移除自己 */
    public remove(): void {
        if (this.node && cc.isValid(this.node)) {
            this.node.destroy();
        }
    }

    protected onDestroy(): void {
        // 移除操作回调
        for (let i = 0; i < this.bindedNodes.length; ++i) {
            let node = this.bindedNodes[i];
            node.targetOff(this);
        }
        delete this.bindedNodes;
        // 移除全局事件监听,网络事件监听
        Emitter.getInstance().targetOff(this);
        // 移除所有计时器
        this.unscheduleAllCallbacks();
        // 释放数据模型,视图
        delete this.model;
        delete this.view;
    }
    /** 是否是iPhoneX */
    public isIPhoneX(): boolean {
        let size = cc.view.getFrameSize();
        if (cc.sys.isNative && cc.sys.platform == cc.sys.IPHONE && ((size.width == 2436 && size.height == 1125) || (size.width == 1125 && size.height == 2436))) {
            return true;
        }
        return false;
    }
    /**
     * 重设Canvas设计分辨率
     * @param canvas 需要重设设计分辨率的canvas
     */
    public resetDesignResolution(canvas: cc.Canvas): void {
        let height = 720;
        let size = cc.view.getFrameSize();
        let proportion = size.width / size.height;
        let width = height * proportion;
        canvas.designResolution = new cc.Size(width, height)
        canvas.fitHeight = true
        canvas.fitWidth = true
    }
}
