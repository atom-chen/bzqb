const maxOpLength = 100;

export default class LogMgr {
    //单例处理
    private static _instance: LogMgr = new LogMgr();
    public static getInstance(): LogMgr {
        return LogMgr._instance;
    }

    public pushLog(str: string): void {
        let arr = window['__errorOp'];
        arr.push(str);
        if (arr.length > maxOpLength) {
            arr.shift();//移除第一个内容
        }
    }
    //加入操作记录
    public addOpreation(op: string): void {
        this.pushLog(op);
    }

    public switchScene(sceneName: string): void {
        this.pushLog(`跳转${sceneName}`);
    }

    public addRequire(route: string): void {
        this.pushLog(`请求${route}`);
    }

    public addRespond(route: string): void {
        this.pushLog(`收到${route}`);
    }

    public showSubModule(prefabName: string): void {
        this.pushLog(`弹出${prefabName}`);
    }
}