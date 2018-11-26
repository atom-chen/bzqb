import GameNet from "../modules/GameNet";
import ModuleMgr from "../modules/ModuleMgr";
import Emitter from "../modules/Emitter";
import Loader from "../modules/Loader";
import Package from "../net/package";

//基础的管理器
export default class BaseMgr {
    protected routes: object;
    constructor() {
        Emitter.getInstance().registerRoute(this);
        this.routes = {};
    }

    public dealResp(route: string, msg: Package): void {
        if (this.routes[route]) this.routes[route].call(this, msg);
    }

    //发送全局事件
    public gemit(event: string, ...arg: any[]): boolean {
        return Emitter.getInstance().emit(event, ...arg);
    }

    public send_msg(route: string, msg?: any): void {
        return GameNet.getInstance().send_msg(route, msg);
    }

    public loadConfig(configName: string): Promise<cc.JsonAsset> {
        return Loader.getInstance().loadConfig(`config/${configName}`);
    }

    public getConfigSync(configName: string): cc.JsonAsset {
        let url = ModuleMgr.getInstance().getResUrl("config", configName);
        return Loader.getInstance().getRes(url, cc.JsonAsset);
    }

    /**
	 * 打开子模块
	 * @param moduleName 模块名
	 */
    protected openSubModule(moduleName: string, isPublic: boolean = false): Promise<any> {
        return ModuleMgr.getInstance().openSubModule(moduleName, isPublic);
    }

    public closeModule(moduleName: string): void {
        ModuleMgr.getInstance().closeModule(moduleName);
    }
    /**
	 * 切换场景
	 * @param sceneName 场景名
	 */
    protected switchScene(sceneName: string): void {
        ModuleMgr.getInstance().switchScene(sceneName);
    }

    public destroy(): void {
        Emitter.getInstance().unregisterRoute(this);
    }
}
