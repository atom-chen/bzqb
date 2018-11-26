import Loader from "../modules/Loader";
import GameNet from "../modules/GameNet";

export default class ServerMgr {
    //单例处理 
    private static _instance: ServerMgr = new ServerMgr();
    public static getInstance(): ServerMgr {
        return this._instance;
    }
    private _settingPath: string = 'config/localsetting';
    private _localsetting: any = null;
    private _servercfg: any = null;
    private _callback: Function = null;
    private _enableHotUpdate: boolean = false;

    constructor() {
        this._enableHotUpdate = cc.sys.isNative && cc.sys.isMobile;
    }

    public loadLoacalSetting(callback: Function): void {
        this._callback = callback;
        this._localsetting = Loader.getInstance().getRes(this._settingPath, cc.JsonAsset).json;
        this.loadSettingCb();
    }

    public loadSettingCb(): void {
        let xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                let respone = xhr.responseText;
                this._servercfg = JSON.parse(respone);
                console.log("网络配置=", this._servercfg);
                GameNet.getInstance().setServerCfg();
                this._callback(0);
            }
        };
        xhr.timeout = 3000;
        xhr.onerror = () => {
            console.error("下载网络配置出错!");
            this._callback(-1);
        }
        xhr.ontimeout = () => {
            console.error("下载网络配置超时!");
            this._callback(-1);
        }
        let URLProducttag = this._localsetting.producttag;
        if (!cc.sys.isNative && window && window.location && window.location.href) {
            URLProducttag = this.analysisURLParameter(window.location.href).args.producttag;
            // console.log("URLProducttag=", URLProducttag, data.producttag);
        }
        window['__errorReportUrl'] = `${this._localsetting.cfgurl}:10001`;//错误报告地址
        if (!window['__errorUserInfo']) {
            window['__errorUserInfo'] = {};
        }
        window['__errorUserInfo']['tag'] = this._localsetting.producttag;
        let wholeurl = `${this._localsetting.cfgurl}/${URLProducttag || this._localsetting.producttag}.json`
        // console.log("wholeurl=", wholeurl);
        xhr.open("GET", wholeurl, true);
        xhr.send();
    }
    // 解析URL是否带调试参数
    public analysisURLParameter(URL: string): any {
        let arr = URL.split("?")
        let obj = {
            url: null,
            args: {}
        };
        obj.url = arr[0];
        // 拆分后如果长度小于2说明URL是不带参数的
        if (arr.length < 2) return obj;
        let mapArr = arr[1].split("&");
        for (let i = 0; i < mapArr.length; i++) {
            let parameter = mapArr[i].split("=");
            obj.args[parameter[0]] = parameter[1];
        }
        // console.log("解析URL", obj)
        return obj
    }

    public getProductTag(): string {
        return this._localsetting.producttag;
    }

    public isEnableHotUpdate(): boolean {
        return this._enableHotUpdate;
    }

    public getServerCfg(): any {
        return this._servercfg;
    }

    public getHotupdateVersionUrl(): string {
        return `${this._servercfg.hotUrl}`;
    }
}
